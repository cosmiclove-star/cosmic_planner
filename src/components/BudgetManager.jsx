import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Euro, Sliders, AlertCircle, Download } from 'lucide-react';

export default function BudgetManager({ budgetItems, setBudgetItems, totalBudget, setTotalBudget }) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(totalBudget);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'paid', 'pending'

  const handleSaveBudget = () => {
    const parsed = parseFloat(tempBudget);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalBudget(parsed);
    }
    setIsEditingBudget(false);
  };
  const [newItem, setNewItem] = useState({
    category: 'Ceremonia',
    name: '',
    estimated: '',
    actual: '',
    paid: false
  });

  const CATEGORIES = [
    'Ceremonia',
    'Espacio y catering',
    'Fotografía y Video',
    'Decoración y Flores',
    'Música y entretenimiento',
    'Vestuario y Belleza',
    'Wedding Planner / coordinación',
    'Papelería e Invitaciones',
    'Transporte y Alojamiento',
    'Detalles e Invitados',
    'Viaje de Novios',
    'Otros detalles'
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.estimated) return;

    const item = {
      id: Date.now().toString(),
      category: newItem.category,
      name: newItem.name.trim(),
      estimated: parseFloat(newItem.estimated) || 0,
      actual: parseFloat(newItem.actual) || parseFloat(newItem.estimated) || 0,
      paid: newItem.paid
    };

    setBudgetItems([...budgetItems, item]);
    setNewItem({
      category: newItem.category,
      name: '',
      estimated: '',
      actual: '',
      paid: false
    });
  };

  const handleDeleteItem = (id) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    setItemToDelete(null);
  };

  const handleTogglePaid = (id) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        return { ...item, paid: !item.paid };
      }
      return item;
    }));
  };

  const handleActualChange = (id, val) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        return { ...item, actual: parseFloat(val) || 0 };
      }
      return item;
    }));
  };

  const handleExportCSV = () => {
    // UTF-8 BOM to make sure Excel detects the encoding correctly (so characters like € or accents display right)
    let csvContent = "\uFEFF";
    
    // Headers
    const headers = ["Concepto", "Categoría", "Coste Estimado (€)", "Coste Real (€)", "Estado de Pago"];
    csvContent += headers.join(";") + "\r\n";
    
    // Rows
    budgetItems.forEach(item => {
      const row = [
        item.name,
        item.category,
        item.estimated.toString().replace('.', ','),
        item.actual.toString().replace('.', ','),
        item.paid ? "Pagado" : "Pendiente"
      ];
      // escape double quotes or semicolons if any
      const escapedRow = row.map(val => {
        let clean = val.replace(/"/g, '""');
        if (clean.includes(';') || clean.includes('\n') || clean.includes('\r') || clean.includes('"')) {
          clean = `"${clean}"`;
        }
        return clean;
      });
      csvContent += escapedRow.join(";") + "\r\n";
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `presupuesto_cosmic_love.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cálculos
  const totalEstimated = budgetItems.reduce((acc, item) => acc + item.estimated, 0);
  const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);
  const totalPaid = budgetItems.reduce((acc, item) => acc + (item.paid ? item.actual : 0), 0);

  const budgetOver = totalActual > totalBudget;

  const filteredItems = budgetItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'paid' && item.paid) || 
                          (statusFilter === 'pending' && !item.paid);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="budget-view fade-in">
      <div className="budget-header-box">
        <h2>Control del Presupuesto</h2>
        <p>Planificad vuestros gastos con total transparencia. Las bodas boutique se definen por priorizar lo que de verdad os importa.</p>
      </div>

      {/* Tarjetas de Resumen Financiero */}
      <section className="budget-summary-grid">
        <div className="summary-card card">
          <span className="summary-label">Presupuesto Límite</span>
          {isEditingBudget ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', marginBottom: '4px' }}>
              <input
                type="number"
                className="form-control"
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '20px', 
                  padding: '4px 8px', 
                  width: '120px',
                  borderRadius: 0,
                  border: '1px solid var(--ink)'
                }}
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                onBlur={handleSaveBudget}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBudget();
                  if (e.key === 'Escape') {
                    setTempBudget(totalBudget);
                    setIsEditingBudget(false);
                  }
                }}
                autoFocus
              />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>€</span>
            </div>
          ) : (
            <div 
              className="summary-value" 
              onClick={() => {
                setTempBudget(totalBudget);
                setIsEditingBudget(true);
              }}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
              title="Haz clic para modificar"
            >
              <span>{totalBudget.toLocaleString('es-ES')} €</span>
              <Sliders size={12} className="edit-budget-icon" style={{ opacity: 0.4, color: 'var(--accent)', flexShrink: 0 }} />
            </div>
          )}
          <span className="summary-footer text-muted">Haz clic para modificar</span>
        </div>

        <div className="summary-card card">
          <span className="summary-label">Gastos Estimados</span>
          <div className="summary-value" style={{ whiteSpace: 'nowrap' }}>{totalEstimated.toLocaleString('es-ES')} €</div>
          <span className="summary-footer">Total de previsiones iniciales</span>
        </div>

        <div className="summary-card card select-ink">
          <span className="summary-label">Coste Real Actual</span>
          <div className="summary-value" style={{ color: budgetOver ? 'var(--red)' : 'var(--ink)', whiteSpace: 'nowrap' }}>
            {totalActual.toLocaleString('es-ES')} €
          </div>
          {budgetOver ? (
            <span className="summary-footer warning-text">
              <AlertCircle size={10} className="inline-icon" /> Superado por {(totalActual - totalBudget).toLocaleString('es-ES')} €
            </span>
          ) : (
            <span className="summary-footer success-text">Disponibles {(totalBudget - totalActual).toLocaleString('es-ES')} €</span>
          )}
        </div>

        <div className="summary-card card">
          <span className="summary-label">Total Pagado</span>
          <div className="summary-value" style={{ whiteSpace: 'nowrap' }}>{totalPaid.toLocaleString('es-ES')} €</div>
          <span className="summary-footer">Pendiente: {(totalActual - totalPaid).toLocaleString('es-ES')} €</span>
        </div>
      </section>

      {/* Sección Dos Columnas: Formulario de Adición + Tabla */}
      <div className="budget-main-grid">
        {/* Formulario */}
        <div className="card add-item-panel">
          <h3>Añadir Proveedor / Gasto</h3>
          <form onSubmit={handleAddItem} className="budget-form">
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="form-control"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Concepto / Proveedor</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Catering El Invernadero, Fotógrafo Boho..."
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Coste Estimado (€)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={newItem.estimated}
                  onChange={(e) => setNewItem({ ...newItem, estimated: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Coste Real (€)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Opcional"
                  value={newItem.actual}
                  onChange={(e) => setNewItem({ ...newItem, actual: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              <Plus size={14} /> Registrar Gasto
            </button>
          </form>
        </div>

        {/* Listado y Tabla */}
        <div className="card budget-list-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0, fontSize: '20px' }}>Detalle de Gastos</h3>
            <button 
              type="button" 
              onClick={handleExportCSV} 
              className="btn btn-secondary btn-export-excel"
              title="Descargar todos los gastos en un archivo Excel (CSV)"
            >
              <Download size={12} /> Exportar Excel
            </button>
          </div>

          {budgetItems.length === 0 ? (
            <div className="empty-state">
              <p>No habéis registrado ningún gasto todavía. Utilizad el formulario para comenzar a estructurar vuestro presupuesto.</p>
            </div>
          ) : (
            <>
              <div className="budget-filters-bar">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Buscar por concepto o categoría..."
                    className="form-control filter-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    Todos ({budgetItems.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'paid' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('paid')}
                  >
                    Pagados ({budgetItems.filter(i => i.paid).length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pendientes ({budgetItems.filter(i => !i.paid).length})
                  </button>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="empty-state">
                  <p>No se encontró ningún gasto que coincida con la búsqueda o filtro.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="budget-table">
                    <thead>
                      <tr>
                        <th>Concepto / Categoría</th>
                        <th>Estimado</th>
                        <th>Real</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr key={item.id} className={item.paid ? 'row-paid' : ''}>
                          <td>
                            <div className="item-name-box">
                              <span className="item-name">{item.name}</span>
                              <span className="item-cat">{item.category}</span>
                            </div>
                          </td>
                          <td>{item.estimated.toLocaleString('es-ES')} €</td>
                          <td>
                            <input
                              type="number"
                              className="table-input"
                              value={item.actual}
                              onChange={(e) => handleActualChange(item.id, e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`paid-status-btn ${item.paid ? 'paid' : ''}`}
                              onClick={() => handleTogglePaid(item.id)}
                            >
                              {item.paid ? (
                                <span className="badge-paid"><CheckCircle2 size={12} /> Pagado</span>
                              ) : (
                                <span className="badge-pending"><Circle size={12} /> Pendiente</span>
                              )}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => setItemToDelete(item)}
                              title="Eliminar partida"
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
            </>
          )}
        </div>
      </div>

      {itemToDelete && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-card card">
            <h4>¿Estás seguro?</h4>
            <p>¿Quieres eliminar la partida "{itemToDelete.name}" del presupuesto?</p>
            <div className="confirm-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setItemToDelete(null)}>
                Volver atrás
              </button>
              <button type="button" className="btn btn-primary" onClick={() => handleDeleteItem(itemToDelete.id)}>
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .budget-view {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .budget-header-box {
          margin-bottom: 32px;
        }
        .budget-header-box h2 {
          font-size: 32px;
          margin-bottom: 6px;
        }
        
        /* Summary Grid */
        .budget-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        @media (max-width: 1000px) {
          .budget-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .budget-summary-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }
          .summary-card {
            padding: 16px 12px;
          }
          .summary-label {
            font-size: 8px;
            margin-bottom: 4px;
          }
          .summary-value {
            font-size: 20px;
            margin-bottom: 4px;
            white-space: nowrap;
          }
          .summary-footer {
            font-size: 9px;
          }
          .summary-card input {
            font-size: 15px !important;
            padding: 2px 4px !important;
            width: 80px !important;
          }
        }
        .summary-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-family: var(--font-sans);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .summary-value {
          font-family: var(--font-serif);
          font-size: 28px;
          color: var(--ink);
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .summary-footer {
          font-size: 10px;
          letter-spacing: 0.02em;
        }
        .select-ink {
          background-color: var(--cream-dark);
          border-color: var(--line);
        }
        .warning-text {
          color: var(--red);
          font-weight: 500;
        }
        .success-text {
          color: var(--green);
          font-weight: 500;
        }
        .inline-icon {
          display: inline;
          vertical-align: middle;
          margin-right: 2px;
        }

        /* Dos Columnas Main */
        .budget-main-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .budget-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .add-item-panel h3, .budget-list-panel h3 {
          font-size: 20px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .budget-form {
          display: flex;
          flex-direction: column;
        }
        .budget-list-panel {
          overflow: hidden;
        }
        
        /* Tabla */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .budget-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .budget-table th {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 12px;
          border-bottom: 1px solid var(--line);
        }
        .budget-table td {
          padding: 14px 12px;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
        }
        .budget-table td:nth-child(2) {
          font-family: var(--font-serif);
          font-size: 14px;
        }
        .row-paid {
          background-color: rgba(99, 125, 101, 0.02);
        }
        .item-name-box {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-weight: 500;
          color: var(--ink);
        }
        .item-cat {
          font-size: 10px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }
        .table-input {
          width: 80px;
          padding: 4px 8px;
          border: 1px solid var(--line);
          background: transparent;
          font-size: 13px;
          font-family: var(--font-serif);
          color: var(--ink);
        }
        .table-input:focus {
          outline: none;
          border-color: var(--ink);
          background: var(--white);
        }
        .paid-status-btn {
          background: none;
          border: none;
          cursor: pointer;
        }
        .badge-paid {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--green);
          font-weight: 500;
          font-size: 11px;
        }
        .badge-pending {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--muted);
          font-size: 11px;
        }
        .badge-pending:hover {
          color: var(--ink);
        }
        .btn-delete {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          transition: var(--transition);
          padding: 4px;
        }
        .btn-delete:hover {
          color: var(--red);
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
        }
        @media (max-width: 768px) {
          .table-responsive {
            overflow-x: visible;
          }
          .budget-table thead {
            display: none;
          }
          .budget-table, .budget-table tbody, .budget-table tr, .budget-table td {
            display: block;
            width: 100%;
          }
          .budget-table tr {
            border: 1px solid var(--line);
            padding: 16px;
            margin-bottom: 16px;
            background-color: var(--white);
            position: relative;
            box-shadow: var(--shadow-subtle);
          }
          .budget-table tr.row-paid {
            background-color: rgba(99, 125, 101, 0.02);
            border-color: rgba(99, 125, 101, 0.2);
          }
          .budget-table td {
            padding: 0;
            border-bottom: none;
            margin-bottom: 12px;
          }
          .budget-table td:last-child {
            margin-bottom: 0;
          }
          .budget-table td:nth-child(1) {
            padding-right: 36px;
          }
          .item-name {
            font-size: 15px;
            font-weight: 600;
          }
          .budget-table td:nth-child(2), .budget-table td:nth-child(3) {
            display: inline-flex;
            width: 50%;
            flex-direction: column;
            gap: 4px;
            vertical-align: top;
          }
          .budget-table td:nth-child(2)::before {
            content: "Estimado";
            font-family: var(--font-sans);
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--muted);
            letter-spacing: 0.05em;
          }
          .budget-table td:nth-child(3)::before {
            content: "Real";
            font-family: var(--font-sans);
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--muted);
            letter-spacing: 0.05em;
          }
          .table-input {
            width: 100%;
            max-width: 110px;
            padding: 6px 10px;
            background-color: var(--cream);
          }
          .budget-table td:nth-child(4) {
            border-top: 1px solid var(--line);
            padding-top: 12px;
            margin-top: 4px;
            display: flex;
            width: 100%;
            vertical-align: middle;
          }
          .paid-status-btn {
            width: 100%;
          }
          .badge-paid, .badge-pending {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--line);
            justify-content: center;
            box-sizing: border-box;
            height: 36px;
            display: flex;
            align-items: center;
          }
          .badge-paid {
            background-color: rgba(99, 125, 101, 0.06);
            border-color: var(--green);
          }
          .badge-pending {
            background-color: var(--cream);
          }
          .budget-table td:nth-child(5) {
            border-top: none;
            padding-top: 0;
            margin-top: 0;
            display: flex;
            width: auto;
            position: absolute;
            top: 16px;
            right: 16px;
          }
          .btn-delete {
            width: 24px;
            height: 24px;
            padding: 0;
            background-color: transparent;
            border: none;
            color: var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .btn-delete:hover {
            color: var(--red);
          }
        }
        .confirm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(26, 26, 26, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        .confirm-modal-card {
          max-width: 400px;
          width: 90%;
          padding: 32px;
          text-align: center;
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .confirm-modal-card h4 {
          font-size: 20px;
          font-family: var(--font-serif);
          margin-bottom: 12px;
        }
        .confirm-modal-card p {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .confirm-modal-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        .confirm-modal-actions .btn {
          padding: 10px 20px;
          font-size: 10px;
          flex: 1;
        }

        /* Buscador y Filtros */
        .btn-export-excel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          padding: 8px 16px;
          margin-top: 0;
          height: auto;
        }
        .budget-filters-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          align-items: center;
          flex-wrap: wrap;
          background-color: var(--white);
        }
        .search-input-wrapper {
          flex: 1;
          min-width: 200px;
        }
        .filter-search-input {
          font-size: 13px !important;
          padding: 8px 12px !important;
          border: 1px solid var(--line) !important;
          background-color: var(--cream) !important;
          border-radius: 0 !important;
          height: auto !important;
          width: 100% !important;
        }
        .filter-search-input:focus {
          border-color: var(--ink) !important;
          background-color: var(--white) !important;
        }
        .filter-pills {
          display: flex;
          gap: 8px;
        }
        .filter-pill {
          background-color: var(--cream);
          border: 1px solid var(--line);
          padding: 6px 12px;
          font-size: 11px;
          font-family: var(--font-sans);
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: var(--transition);
        }
        .filter-pill:hover {
          border-color: var(--accent);
          color: var(--ink);
        }
        .filter-pill.active {
          background-color: var(--ink);
          border-color: var(--ink);
          color: var(--white);
        }

        @media (max-width: 600px) {
          .btn-export-excel {
            font-size: 8px !important;
            padding: 6px 10px !important;
          }
          .btn-export-excel svg {
            width: 10px;
            height: 10px;
          }
          .budget-filters-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .filter-pills {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .filter-pill {
            text-align: center;
            font-size: 9px;
            padding: 8px 2px;
          }
        }
      `}</style>
    </div>
  );
}
