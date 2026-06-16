import React, { useState } from 'react';
import { Plus, Trash2, Search, Check, X, AlertTriangle, Users, Filter, Download, Gift } from 'lucide-react';

export default function GuestListManager({ guests, setGuests, weddingData = {} }) {
  const [newGuest, setNewGuest] = useState({
    name: '',
    side: 'Común',
    diet: '',
    status: 'pending',
    isChild: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSide, setFilterSide] = useState('all');

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;

    const guest = {
      id: Date.now().toString(),
      name: newGuest.name.trim(),
      side: newGuest.side,
      diet: newGuest.diet.trim(),
      status: newGuest.status,
      isChild: newGuest.isChild,
      tableId: null, // Se asignará en el seating plan
      giftDesc: '',
      giftAmount: 0
    };

    setGuests([...guests, guest]);
    setNewGuest({
      name: '',
      side: 'Común',
      diet: '',
      status: 'pending',
      isChild: false
    });
  };

  const handleDeleteGuest = (id) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setGuests(guests.map(g => {
      if (g.id === id) {
        return { ...g, status: newStatus };
      }
      return g;
    }));
  };

  const handleUpdateGift = (id, newDesc, newAmount) => {
    setGuests(guests.map(g => {
      if (g.id === id) {
        return { ...g, giftDesc: newDesc, giftAmount: newAmount };
      }
      return g;
    }));
  };

  const handleExportCSV = () => {
    let csvContent = "\uFEFF"; // UTF-8 BOM
    const headers = ["Nombre", "Familia (Lado)", "Dieta / Alergia", "Menú Infantil", "Mesa asignada", "Estado Asistencia", "Descripción Regalo", "Importe Regalo (€)"];
    csvContent += headers.join(";") + "\r\n";
    
    guests.forEach(g => {
      const row = [
        g.name,
        g.side,
        g.diet || "-",
        g.isChild ? "Sí" : "No",
        g.tableId || "Sin asignar",
        g.status === 'confirmed' ? "Confirmado" : g.status === 'pending' ? "Pendiente" : "No asiste",
        g.giftDesc || "-",
        (g.giftAmount || 0).toString().replace('.', ',')
      ];
      const escapedRow = row.map(val => {
        let clean = val.toString().replace(/"/g, '""');
        if (clean.includes(';') || clean.includes('\n') || clean.includes('\r') || clean.includes('"')) {
          clean = `"${clean}"`;
        }
        return clean;
      });
      csvContent += escapedRow.join(";") + "\r\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `invitados_y_regalos_cosmic_love.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrado de invitados
  const filteredGuests = guests.filter(g => {
    const query = searchTerm.toLowerCase().trim();
    
    const childKeywords = ['niño', 'niña', 'niños', 'niñas', 'nino', 'nina', 'infantil', 'menu infantil', 'menú infantil'];
    const searchRefersToChild = query && childKeywords.some(keyword => keyword.includes(query) || query.includes(keyword));

    const matchesSearch = !query || 
                          g.name.toLowerCase().includes(query) || 
                          g.diet.toLowerCase().includes(query) ||
                          (g.isChild && searchRefersToChild);
    const matchesStatus = filterStatus === 'all' ? true : g.status === filterStatus;
    const matchesSide = filterSide === 'all' ? true : g.side === filterSide;
    return matchesSearch && matchesStatus && matchesSide;
  });

  // Métricas
  const totalGuests = guests.length;
  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const dietCount = guests.filter(g => g.diet).length;
  const childCount = guests.filter(g => g.isChild).length;
  const totalGiftsAmount = guests.reduce((sum, g) => sum + (g.giftAmount || 0), 0);
  const guestsWithGiftsCount = guests.filter(g => (g.giftDesc && g.giftDesc.trim() !== '') || (g.giftAmount && g.giftAmount > 0)).length;

  return (
    <div className="guest-view fade-in">
      <div className="guest-header-box">
        <h2>Lista de Invitados</h2>
        <p>Gestionad vuestra lista de familiares y amigos. Controlad su confirmación y necesidades especiales para el banquete.</p>
      </div>

      {/* Tarjetas de Métricas de Invitados */}
      <section className="guest-summary-grid">
        <div className="summary-card card">
          <span className="summary-label">Total Invitados</span>
          <div className="summary-value">{totalGuests}</div>
        </div>

        <div className="summary-card card select-green">
          <span className="summary-label">Confirmados</span>
          <div className="summary-value" style={{ color: 'var(--green)' }}>{confirmedCount}</div>
        </div>

        <div className="summary-card card">
          <span className="summary-label">Pendientes</span>
          <div className="summary-value">{pendingCount}</div>
        </div>

        <div className="summary-card card select-ink">
          <span className="summary-label">Regalos Recibidos</span>
          <div className="summary-value" style={{ color: 'var(--gold-hover)' }}>{totalGiftsAmount.toLocaleString('es-ES')} €</div>
          <span className="summary-footer" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
            {guestsWithGiftsCount} regalos registrados
          </span>
        </div>

        <div className="summary-card card">
          <span className="summary-label">Alergias / Dietas</span>
          <div className="summary-value">{dietCount}</div>
        </div>

        <div className="summary-card card">
          <span className="summary-label">Menús Infantiles</span>
          <div className="summary-value">{childCount}</div>
        </div>
      </section>

      {/* Grid Principal */}
      <div className="guest-main-grid">
        {/* Formulario */}
        <div className="card add-guest-panel">
          <h3>Añadir Invitado</h3>
          <form onSubmit={handleAddGuest} className="guest-form">
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Carmen García"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lado de la familia</label>
              <select
                className="form-control"
                value={newGuest.side}
                onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value })}
              >
                <option value="Novio">Lado de {weddingData.coupleName1 || 'Novio'}</option>
                <option value="Novia">Lado de {weddingData.coupleName2 || 'Novia'}</option>
                <option value="Común">Común</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Alergias o Restricciones Dietéticas</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Celíaco, Vegano, Alergia a frutos secos..."
                value={newGuest.diet}
                onChange={(e) => setNewGuest({ ...newGuest, diet: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0' }}>
              <input
                type="checkbox"
                id="newGuestIsChild"
                style={{ width: '16px', height: '16px', accentColor: 'var(--ink)', cursor: 'pointer' }}
                checked={newGuest.isChild}
                onChange={(e) => setNewGuest({ ...newGuest, isChild: e.target.checked })}
              />
              <label htmlFor="newGuestIsChild" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', textTransform: 'none', fontSize: '11px', letterSpacing: '0.05em', color: 'var(--ink)' }}>
                Es un niño/a (Menú Infantil)
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Estado Inicial</label>
              <select
                className="form-control"
                value={newGuest.status}
                onChange={(e) => setNewGuest({ ...newGuest, status: e.target.value })}
              >
                <option value="pending">Pendiente de Confirmar</option>
                <option value="confirmed">Confirmado</option>
                <option value="declined">Declinado / No asiste</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              <Plus size={14} /> Añadir a la lista
            </button>
          </form>
        </div>

        {/* Listado con Filtros */}
        <div className="card guest-list-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0, fontSize: '20px' }}>Invitados ({filteredGuests.length})</h3>
            <button 
              type="button" 
              onClick={handleExportCSV} 
              className="btn btn-secondary btn-export-excel"
              title="Descargar lista de invitados en un archivo Excel (CSV)"
            >
              <Download size={12} /> Exportar Lista
            </button>
          </div>

          {/* Barra Unificada de Búsqueda y Filtros */}
          <div className="search-filters-bar">
            {/* Buscador */}
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre, dieta o 'niños'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="filters-group-container">
              <div className="filter-label-box">
                <Filter size={12} className="filter-icon" />
                <span className="filter-label">Filtros:</span>
              </div>

              <div className="filter-selects-box">
                <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Todos los estados</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="pending">Pendientes</option>
                  <option value="declined">Declinados</option>
                </select>

                <select className="filter-select" value={filterSide} onChange={(e) => setFilterSide(e.target.value)}>
                  <option value="all">Común</option>
                  <option value="Novio">Lado Novio</option>
                  <option value="Novia">Lado Novia</option>
                </select>
              </div>
            </div>
          </div>

          {filteredGuests.length === 0 ? (
            <div className="empty-state">
              <p>No se han encontrado invitados que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="guest-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Lado</th>
                    <th>Dieta / Alergia</th>
                    <th>Regalo / Aportación</th>
                    <th>Estado de Confirmación</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((g) => (
                    <tr key={g.id} className={`guest-row-${g.status}`}>
                      <td className="guest-name-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {g.name}
                          {g.isChild && (
                            <span className="child-badge" style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--muted)', fontSize: '9px', fontWeight: '600', padding: '2px 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Niño/a
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="guest-side-badge">{g.side}</span>
                      </td>
                      <td>
                        {g.diet ? (
                          <span className="diet-alert-badge">
                            <AlertTriangle size={10} className="inline-icon" /> {g.diet}
                          </span>
                        ) : (
                          <span className="text-light">-</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="table-input"
                            style={{ width: '120px', fontSize: '12.5px', padding: '6px 8px' }}
                            placeholder="Ej. Ingreso, Vajilla..."
                            value={g.giftDesc || ''}
                            onChange={(e) => handleUpdateGift(g.id, e.target.value, g.giftAmount)}
                          />
                          <input
                            type="number"
                            className="table-input"
                            style={{ width: '75px', fontSize: '12.5px', padding: '6px 8px', fontFamily: 'var(--font-serif)' }}
                            placeholder="0 €"
                            value={g.giftAmount || ''}
                            onChange={(e) => handleUpdateGift(g.id, g.giftDesc, parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="guest-status-actions">
                          <button
                            type="button"
                            className={`status-btn confirm ${g.status === 'confirmed' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(g.id, 'confirmed')}
                            title="Confirmar asistencia"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            className={`status-btn pending ${g.status === 'pending' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(g.id, 'pending')}
                            title="Poner en pendiente"
                          >
                            ?
                          </button>
                          <button
                            type="button"
                            className={`status-btn decline ${g.status === 'declined' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(g.id, 'declined')}
                            title="Decline/No asiste"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDeleteGuest(g.id)}
                          title="Eliminar invitado"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .guest-view {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .guest-header-box {
          margin-bottom: 32px;
        }
        .guest-header-box h2 {
          font-size: 32px;
          margin-bottom: 6px;
        }
        
        /* Summary Grid */
        .guest-summary-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .summary-card {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
        }
        @media (max-width: 900px) {
          .guest-summary-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;
          }
          .guest-summary-grid > * {
            grid-column: span 2;
          }
        }
        @media (max-width: 600px) {
          .guest-summary-grid {
            gap: 8px;
          }
          .summary-card {
            padding: 12px 6px;
            text-align: center;
          }
          .summary-label {
            font-size: 9.5px;
            margin-bottom: 4px;
            letter-spacing: 0.05em;
          }
          .summary-value {
            font-size: 22px;
            margin-bottom: 0;
          }
        }
        .select-green {
          background-color: rgba(99, 125, 101, 0.05);
          border-color: rgba(99, 125, 101, 0.2);
        }

        /* Layout */
        .guest-main-grid {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 24px;
        }
        @media (max-width: 950px) {
          .guest-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .add-guest-panel h3, .guest-list-panel h3 {
          font-size: 20px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .guest-form {
          display: flex;
          flex-direction: column;
        }
        
        /* Barra de Búsqueda y Filtros Unificada */
        .search-filters-bar {
          background-color: var(--cream);
          border: 1px solid var(--line);
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Buscador */
        .search-box {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--accent);
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid var(--line);
          background-color: var(--white);
          font-family: var(--font-sans);
          font-size: 13px;
          outline: none;
          transition: var(--transition);
          border-radius: 0;
        }
        .search-input:focus {
          border-color: var(--ink);
        }

        /* Filtros */
        .filters-group-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-top: 1px dashed var(--line);
          padding-top: 16px;
        }
        .filter-label-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-icon {
          color: var(--muted);
        }
        .filter-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .filter-selects-box {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .filter-select {
          padding: 8px 16px;
          border: 1px solid var(--line);
          background-color: var(--white);
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--muted);
          outline: none;
          transition: var(--transition);
          border-radius: 0;
        }
        .filter-select:focus {
          border-color: var(--ink);
          color: var(--ink);
        }

        @media (max-width: 600px) {
          .search-filters-bar {
            padding: 12px;
            gap: 12px;
          }
          .filters-group-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding-top: 12px;
            width: 100%;
          }
          .filter-selects-box {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .filter-select {
            width: 100%;
          }
        }

        /* Elementos de Tabla */
        .guest-name-cell {
          font-weight: 500;
          color: var(--ink);
        }
        .guest-side-badge {
          background-color: var(--cream-dark);
          color: var(--muted);
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .diet-alert-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(162, 95, 95, 0.08);
          border: 1px solid rgba(162, 95, 95, 0.2);
          color: var(--red);
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 500;
        }
        .guest-row-confirmed {
          background-color: rgba(99, 125, 101, 0.01);
        }
        .guest-row-declined {
          opacity: 0.65;
          text-decoration: line-through;
        }
        .guest-status-actions {
          display: flex;
          gap: 6px;
        }
        .status-btn {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--line);
          background-color: var(--white);
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--muted);
          transition: var(--transition);
        }
        .status-btn.confirm:hover, .status-btn.confirm.active {
          background-color: var(--green);
          border-color: var(--green);
          color: var(--white);
        }
        .status-btn.pending:hover, .status-btn.pending.active {
          background-color: var(--accent);
          border-color: var(--accent);
          color: var(--white);
        }
        .status-btn.decline:hover, .status-btn.decline.active {
          background-color: var(--red);
          border-color: var(--red);
          color: var(--white);
        }
        .text-light {
          color: var(--accent);
          font-style: italic;
        }
        @media (max-width: 768px) {
          .table-responsive {
            overflow-x: visible;
          }
          .guest-table thead {
            display: none;
          }
          .guest-table, .guest-table tbody, .guest-table tr, .guest-table td {
            display: block;
            width: 100%;
          }
          .guest-table tr {
            border: 1px solid var(--line);
            padding: 16px;
            margin-bottom: 16px;
            background-color: var(--white);
            position: relative;
            box-shadow: var(--shadow-subtle);
          }
          .guest-table tr.guest-row-confirmed {
            background-color: rgba(99, 125, 101, 0.01);
            border-color: rgba(99, 125, 101, 0.15);
          }
          .guest-table tr.guest-row-declined {
            opacity: 0.7;
            background-color: rgba(162, 95, 95, 0.01);
            border-color: rgba(162, 95, 95, 0.15);
          }
          .guest-table td {
            padding: 0;
            border-bottom: none;
            margin-bottom: 10px;
          }
          .guest-table td:last-child {
            margin-bottom: 0;
          }
          .guest-table td:nth-child(1) {
            padding-right: 35px;
          }
          .guest-name-cell {
            font-size: 15px;
            font-weight: 600;
          }
          .guest-table td:nth-child(2) {
            display: inline-block;
            margin-right: 8px;
            width: auto;
          }
          .guest-table td:nth-child(3) {
            display: inline-block;
            width: auto;
          }
          .guest-table td:nth-child(3) .text-light {
            display: none;
          }
          .guest-table td:nth-child(4) {
            border-top: 1px dashed var(--line);
            padding-top: 10px;
            margin-top: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .guest-table td:nth-child(4)::before {
            content: "Regalo / Aport.";
            font-family: var(--font-sans);
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--muted);
            letter-spacing: 0.05em;
          }
          .guest-table td:nth-child(4) .table-input {
            width: auto !important;
            flex: 1;
            max-width: 100px;
            padding: 4px 6px !important;
          }
          .guest-table td:nth-child(5) {
            border-top: 1px solid var(--line);
            padding-top: 12px;
            margin-top: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .guest-table td:nth-child(5)::before {
            content: "Asistencia";
            font-family: var(--font-sans);
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--muted);
            letter-spacing: 0.05em;
          }
          .guest-status-actions {
            display: flex;
            gap: 12px;
          }
          .status-btn {
            width: 32px;
            height: 32px;
            font-size: 13px;
          }
          .guest-table td:nth-child(6) {
            position: absolute;
            top: 16px;
            right: 16px;
            margin-bottom: 0;
            width: auto;
          }
          .btn-delete {
            padding: 8px;
            background-color: rgba(162, 95, 95, 0.05);
            border: 1px solid rgba(162, 95, 95, 0.1);
            color: var(--red);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
