import React, { useState } from 'react';
import { Plus, Trash2, Users, UserMinus, PlusCircle, Check } from 'lucide-react';

export default function SeatingPlan({ guests, setGuests, tables, setTables }) {
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(8);

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const table = {
      id: Date.now().toString(),
      name: newTableName.trim(),
      capacity: parseInt(newTableCapacity) || 8
    };

    setTables([...tables, table]);
    setNewTableName('');
    setNewTableCapacity(8);
  };

  const handleDeleteTable = (tableId) => {
    // Liberar a todos los invitados sentados en esta mesa
    setGuests(guests.map(g => {
      if (g.tableId === tableId) {
        return { ...g, tableId: null };
      }
      return g;
    }));
    // Borrar la mesa
    setTables(tables.filter(t => t.id !== tableId));
  };

  const handleSeatGuest = (guestId, tableId) => {
    setGuests(guests.map(g => {
      if (g.id === guestId) {
        return { ...g, tableId };
      }
      return g;
    }));
  };

  const handleUnseatGuest = (guestId) => {
    setGuests(guests.map(g => {
      if (g.id === guestId) {
        return { ...g, tableId: null };
      }
      return g;
    }));
  };

  // Solo los invitados CONFIRMADOS pueden sentarse
  const confirmedGuests = guests.filter(g => g.status === 'confirmed');
  const unseatedGuests = confirmedGuests.filter(g => !g.tableId);

  return (
    <div className="seating-view fade-in">
      <div className="seating-header-box">
        <h2>Distribución de Mesas (Seating Plan)</h2>
        <p>Asignad los asientos de vuestros invitados confirmados. Configurad la capacidad y distribución de forma visual.</p>
      </div>

      <div className="seating-main-layout">
        {/* Lado Izquierdo: Gestión de Mesas */}
        <div className="tables-section">
          {/* Formulario Crear Mesa */}
          <div className="card add-table-card">
            <h3>Crear Mesa</h3>
            <form onSubmit={handleAddTable} className="table-form">
              <div className="form-group">
                <label className="form-label">Nombre de la Mesa</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Mesa Presidencial, Mesa 1, Amigos..."
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Capacidad (Asientos)</label>
                <select
                  className="form-control"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(parseInt(e.target.value))}
                >
                  {[4, 6, 8, 10, 12, 14].map(n => <option key={n} value={n}>{n} pax</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                <Plus size={14} /> Añadir Mesa
              </button>
            </form>
          </div>

          {/* Listado Visual de Mesas */}
          <div className="tables-grid">
            {tables.length === 0 ? (
              <div className="empty-tables-card card">
                <p>No hay mesas configuradas aún. Cread la primera mesa para empezar a ubicar a vuestros invitados.</p>
              </div>
            ) : (
              tables.map(table => {
                const seatedHere = confirmedGuests.filter(g => g.tableId === table.id);
                const isFull = seatedHere.length >= table.capacity;

                return (
                  <div key={table.id} className={`table-card card ${isFull ? 'table-full' : ''}`}>
                    <div className="table-card-header">
                      <div>
                        <h4>{table.name}</h4>
                        <span className="table-capacity-indicator">
                          {seatedHere.length} / {table.capacity} asientos ocupados
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-delete-table"
                        onClick={() => handleDeleteTable(table.id)}
                        title="Borrar mesa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Asignar Invitado (Dropdown) */}
                    {!isFull && unseatedGuests.length > 0 && (
                      <div className="seat-select-box">
                        <select
                          className="form-control select-small"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleSeatGuest(e.target.value, table.id);
                              e.target.value = ""; // reset
                            }
                          }}
                        >
                          <option value="" disabled>Sentar un invitado aquí...</option>
                          {unseatedGuests.map(g => (
                            <option key={g.id} value={g.id}>{g.name} ({g.side})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Listado de personas sentadas */}
                    <div className="table-seats-list">
                      {seatedHere.length === 0 ? (
                        <span className="no-seats-text">Mesa vacía</span>
                      ) : (
                        seatedHere.map(g => (
                          <div key={g.id} className="seat-item">
                            <span className="seat-guest-name">
                               {g.name} {g.isChild && <span style={{ fontSize: '10px', marginLeft: '4px' }} title="Niño/a (Menú Infantil)">👶</span>}
                            </span>
                            <button
                              type="button"
                              className="btn-unseat"
                              onClick={() => handleUnseatGuest(g.id)}
                              title="Levantar de la mesa"
                            >
                              <UserMinus size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Lado Derecho: Panel de Invitados sin Mesa */}
        <div className="unseated-section card">
          <div className="unseated-header">
            <h3>Invitados sin Asignar</h3>
            <span className="unseated-count">{unseatedGuests.length} comensales pendientes</span>
          </div>
          <p className="unseated-info-text">
            Solo aparecen los invitados con asistencia confirmada. Haced clic en una mesa para sentarlos.
          </p>

          <div className="unseated-list">
            {unseatedGuests.length === 0 ? (
              <div className="all-seated-state">
                <Check className="check-success" size={24} />
                <p>¡Buen trabajo! Todos los invitados confirmados tienen su asiento asignado.</p>
              </div>
            ) : (
              unseatedGuests.map(g => (
                <div key={g.id} className="unseated-item">
                  <div className="unseated-item-info">
                    <span className="unseated-name">
                       {g.name} {g.isChild && <span style={{ fontSize: '10px', marginLeft: '4px' }} title="Niño/a (Menú Infantil)">👶</span>}
                    </span>
                    <span className="unseated-side">{g.side} {g.isChild && '• Niño/a'}</span>
                  </div>
                  {/* Select mesa directo */}
                  {tables.length > 0 && (
                    <select
                      className="seat-direct-select"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleSeatGuest(g.id, e.target.value);
                        }
                      }}
                    >
                      <option value="" disabled>Sentar en...</option>
                      {tables.map(t => {
                        const count = confirmedGuests.filter(cg => cg.tableId === t.id).length;
                        const full = count >= t.capacity;
                        return (
                          <option key={t.id} value={t.id} disabled={full}>
                            {t.name} ({count}/{t.capacity})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .seating-view {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .seating-header-box {
          margin-bottom: 32px;
        }
        .seating-header-box h2 {
          font-size: 32px;
          margin-bottom: 6px;
        }

        /* Layout */
        .seating-main-layout {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .seating-main-layout {
            grid-template-columns: 1fr;
          }
        }

        /* Seccion Mesas */
        .tables-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .add-table-card h3 {
          font-size: 18px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .table-form {
          display: flex;
          gap: 16px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .table-form .form-group {
          margin-bottom: 0;
          flex: 1;
          min-width: 150px;
        }

        /* Grid de Mesas */
        .tables-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 600px) {
          .tables-grid {
            grid-template-columns: 1fr;
          }
        }
        .table-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 240px;
          border-color: var(--line);
        }
        .table-card h4 {
          font-family: var(--font-serif);
          font-size: 20px;
        }
        .table-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--line);
          padding-bottom: 12px;
          margin-bottom: 12px;
        }
        .table-capacity-indicator {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          display: block;
          margin-top: 2px;
        }
        .btn-delete-table {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-delete-table:hover {
          color: var(--red);
        }
        .table-full {
          border-color: var(--green);
        }
        .seat-select-box {
          margin-bottom: 12px;
        }
        .select-small {
          padding: 8px 12px;
          font-size: 12px;
          height: 36px;
        }
        
        /* Lista Asientos */
        .table-seats-list {
          background-color: var(--cream);
          padding: 12px;
          border: 1px solid var(--line);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 200px;
          overflow-y: auto;
        }
        .seat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--white);
          padding: 6px 10px;
          border: 1px solid var(--line);
          font-size: 12px;
        }
        .seat-guest-name {
          font-weight: 500;
          color: var(--ink);
        }
        .btn-unseat {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-unseat:hover {
          color: var(--red);
        }
        .no-seats-text {
          font-size: 11px;
          color: var(--accent);
          text-align: center;
          padding: 20px 0;
          font-style: italic;
        }

        /* Seccion Sin Asignar */
        .unseated-section {
          align-self: flex-start;
          position: sticky;
          top: 24px;
        }
        .unseated-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--line);
          padding-bottom: 14px;
          margin-bottom: 12px;
        }
        .unseated-header h3 {
          font-size: 18px;
        }
        .unseated-count {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          background-color: var(--cream-dark);
          color: var(--ink);
          padding: 4px 10px;
          letter-spacing: 0.05em;
        }
        .unseated-info-text {
          font-size: 12px;
          margin-bottom: 20px;
        }
        
        .unseated-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 450px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .unseated-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background-color: var(--cream);
          border: 1px solid var(--line);
        }
        .unseated-item-info {
          display: flex;
          flex-direction: column;
        }
        .unseated-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink);
        }
        .unseated-side {
          font-size: 9px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 1px;
        }
        .seat-direct-select {
          padding: 4px 8px;
          font-family: var(--font-sans);
          font-size: 11px;
          border: 1px solid var(--line);
          background-color: var(--white);
          outline: none;
          color: var(--muted);
          max-width: 110px;
        }
        .seat-direct-select:focus {
          border-color: var(--ink);
          color: var(--ink);
        }
        
        .all-seated-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .check-success {
          color: var(--green);
        }
      `}</style>
    </div>
  );
}
