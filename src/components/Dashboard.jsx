import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, DollarSign, Users, Award, Heart, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, CheckSquare, Square, Trash2, Edit3, X, Sparkles, Check, MapPin, User } from 'lucide-react';

const formatName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\b\w/g, c => c.toUpperCase());
};

export default function Dashboard({ data, setWeddingData, guests, budgetItems, activeTab, setActiveTab, events = [], setEvents }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const [editFormData, setEditFormData] = useState({
    date: data?.date || '',
    coupleName1: data?.coupleName1 || '',
    coupleName2: data?.coupleName2 || '',
    location: data?.location || data?.city || '',
    style: data?.style || 'classic',
    budget: data?.budget || 35000
  });

  useEffect(() => {
    if (isEditModalOpen && data) {
      setEditFormData({
        date: data.date || '',
        coupleName1: data.coupleName1 || '',
        coupleName2: data.coupleName2 || '',
        location: data.location || data.city || '',
        style: data.style || 'classic',
        budget: data.budget || 35000
      });
    }
  }, [isEditModalOpen, data]);

  const handleSaveWeddingData = async (e) => {
    e.preventDefault();
    if (!editFormData.coupleName1.trim() || !editFormData.coupleName2.trim()) {
      alert('Por favor, introduce los nombres de ambos novios.');
      return;
    }

    if (setWeddingData) {
      await setWeddingData({
        ...data,
        coupleName1: editFormData.coupleName1.trim(),
        coupleName2: editFormData.coupleName2.trim(),
        date: editFormData.date,
        location: editFormData.location.trim(),
        city: editFormData.location.trim(),
        style: editFormData.style,
        budget: Number(editFormData.budget) || 35000
      });
    }

    setIsEditModalOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 4000);
  };

  function calculateTimeLeft() {
    if (!data.date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const difference = +new Date(data.date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 100) % 10) // display tenths of seconds or seconds. Let's do simple seconds:
      };
      timeLeft.seconds = Math.floor((difference / 1000) % 60);
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [data.date]);

  // Lógica de Calendario Mensual en Dashboard
  const [selectedDayEventsDate, setSelectedDayEventsDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(() => {
    if (data.date) {
      const wDate = new Date(data.date);
      if (!isNaN(wDate.getTime())) return wDate;
    }
    return new Date();
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0: Dom, 1: Lun
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Ajustar a Lunes inicio
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    // Celdas vacías del principio
    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, dateStr: null });
    }
    // Días del mes
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr });
    }
    return cells;
  };

  const calendarCells = getDaysInMonth();
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const handleToggleComplete = (id) => {
    if (!setEvents) return;
    setEvents(events.map(e => {
      if (e.id === id) {
        return { ...e, completed: !e.completed };
      }
      return e;
    }));
  };

  const handleDeleteEvent = (id) => {
    if (!setEvents) return;
    setEvents(events.filter(e => e.id !== id));
  };

  // Cálculo de Métricas
  const totalBudget = data.budget || 35000;
  const totalSpent = budgetItems.reduce((acc, item) => acc + (item.paid ? item.actual : item.estimated), 0);
  const budgetPercentage = Math.round((totalSpent / totalBudget) * 100) || 0;

  const totalGuestsCount = guests.length;
  const confirmedGuests = guests.filter(g => g.status === 'confirmed').length;
  const guestPercentage = Math.round((confirmedGuests / (data.guests || 120)) * 100) || 0;

  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.completed).length;
  const eventsPercentage = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

  // Estilo traducido a español elegante
  const styleNames = {
    boho: 'Boho & Rustic',
    classic: 'Clásico & Elegante',
    modern: 'Moderno & Minimalista',
    romantic: 'Romántico & Fine Art',
    rustic: 'Campestre & Rústico Chic',
    mediterranean: 'Mediterráneo',
    cosmic: 'Extra Cosmic: Nocturna',
    custom: 'A vuestra manera'
  };

  return (
    <div className="dashboard-view fade-in">
      {/* Cabecera Editorial */}
      <header className="dashboard-header" style={{ position: 'relative' }}>
        {data.location && (
          <div className="header-meta">
            <span>{data.location}</span>
          </div>
        )}
        <h1 className="couple-names">{formatName(data.coupleName1).toUpperCase()} <span style={{ fontFamily: 'inherit', textTransform: 'lowercase' }}>y</span> {formatName(data.coupleName2).toUpperCase()}</h1>
        <p className="wedding-date-text">
          {data.date && !isNaN(new Date(data.date).getTime())
            ? new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : 'Fecha pendiente de definir'}
        </p>
        <button
          type="button"
          className="btn-edit-wedding-header"
          onClick={() => setIsEditModalOpen(true)}
          title="Modificar fecha, nombres o detalles de la boda"
        >
          <Edit3 size={13} /> Editar datos de la boda
        </button>
      </header>

      {/* Cuenta Atrás Premium */}
      <section className="countdown-section">
        <div className="countdown-container">
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="countdown-label">Días</span>
          </div>
          <div className="countdown-divider">:</div>
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="countdown-label">Horas</span>
          </div>
          <div className="countdown-divider">:</div>
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="countdown-label">Min</span>
          </div>
          <div className="countdown-divider">:</div>
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="countdown-label">Seg</span>
          </div>
        </div>
        <div className="countdown-footer">Para el gran día</div>
      </section>

      {/* Métricas Clave */}
      <section className="metrics-grid">
        {/* Presupuesto */}
        <div className="metric-card card" onClick={() => setActiveTab('budget')}>
          <div className="metric-header">
            <span className="metric-title">Presupuesto</span>
            <DollarSign className="metric-icon" size={18} />
          </div>
          <div className="metric-value">{totalSpent.toLocaleString('es-ES')} €</div>
          <div className="metric-subtext">de {totalBudget.toLocaleString('es-ES')} € planificados</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(budgetPercentage, 100)}%`, backgroundColor: budgetPercentage > 100 ? 'var(--red)' : 'var(--gold)' }}></div>
          </div>
          <div className="metric-percentage">{budgetPercentage}% utilizado</div>
        </div>

        {/* Invitados */}
        <div className="metric-card card" onClick={() => setActiveTab('guests')}>
          <div className="metric-header">
            <span className="metric-title">Invitados Confirmados</span>
            <Users className="metric-icon" size={18} />
          </div>
          <div className="metric-value">{confirmedGuests}</div>
          <div className="metric-subtext">de {data.guests || 120} invitados estimados</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(guestPercentage, 100)}%` }}></div>
          </div>
          <div className="metric-percentage">{guestPercentage}% de la meta de asistencia</div>
        </div>

        {/* Progreso Agenda */}
        <div className="metric-card card" onClick={() => setActiveTab('calendar')}>
          <div className="metric-header">
            <span className="metric-title">Progreso Agenda</span>
            <Award className="metric-icon" size={18} />
          </div>
          <div className="metric-value">{completedEvents}</div>
          <div className="metric-subtext">de {totalEvents} tareas planificadas</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${eventsPercentage}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span className="metric-percentage">{eventsPercentage}% completado</span>
            <button 
              className="btn btn-secondary btn-small"
              style={{ padding: '6px 12px', fontSize: '9px', marginTop: 0, height: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('calendar');
              }}
            >
              Todas las Tareas
            </button>
          </div>
        </div>
      </section>

      {/* Calendario Nupcial en Panel de Control */}
      <div className="card monthly-calendar-card" style={{ padding: '32px', marginTop: '24px', width: '100%', clear: 'both' }}>
        <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--ink)', marginBottom: '4px' }}>Calendario de Agenda y Tareas</h3>
          <p className="section-intro" style={{ margin: 0 }}>Visualiza tus tareas planificadas directamente desde tu panel.</p>
        </div>

        <div className="calendar-month-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '8px' }}>
          <button onClick={handlePrevMonth} className="btn-month-nav"><ChevronLeft size={16} /></button>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '500', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={handleNextMonth} className="btn-month-nav"><ChevronRight size={16} /></button>
        </div>

        <div className="calendar-grid-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
          {dayNames.map(day => (
            <span key={day} className="calendar-header-day" style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', padding: '8px 0' }}>
              {day}
            </span>
          ))}
        </div>

        <div className="calendar-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: '130px',
          borderTop: '1px solid var(--line)',
          borderLeft: '1px solid var(--line)'
        }}>
          {calendarCells.map((cell, idx) => {
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
            const isWeddingDay = data.date === cell.dateStr;
            const cellEvents = cell.dateStr ? events.filter(e => e.date === cell.dateStr) : [];
            
            return (
              <div
                key={idx}
                className={`calendar-day-cell ${!cell.day ? 'empty' : ''} ${isToday ? 'today' : ''} ${isWeddingDay ? 'wedding-day' : ''} ${cellEvents.length > 0 ? 'has-events' : ''}`}
                onClick={() => cell.day && cellEvents.length > 0 && setSelectedDayEventsDate(cell.dateStr)}
                style={{
                  borderRight: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                  padding: '8px',
                  backgroundColor: isWeddingDay ? 'rgba(197, 168, 128, 0.08)' : (cell.day ? 'var(--white)' : 'rgba(245, 240, 232, 0.2)'),
                  boxShadow: isWeddingDay ? 'inset 0 0 0 2px var(--gold)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: isWeddingDay ? 2 : 1,
                  cursor: (cell.day && cellEvents.length > 0) ? 'pointer' : 'default',
                  transition: 'var(--transition)'
                }}
              >
                {cell.day && (
                  <>
                    <span className="day-number" style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isWeddingDay ? 'var(--gold-hover)' : 'var(--muted)',
                      marginBottom: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: isToday ? '50%' : '0',
                      backgroundColor: isToday ? 'var(--cream-dark)' : 'transparent',
                      width: isToday ? '20px' : 'auto',
                      height: isToday ? '20px' : 'auto'
                    }}>
                      {cell.day}
                    </span>

                    <div className="calendar-day-events" style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden', flex: 1 }}>
                      {cellEvents.slice(0, 2).map(e => (
                        <div
                          key={e.id}
                          className={`calendar-event-item ${e.completed ? 'completed' : ''}`}
                          title={`[${e.category}] ${e.title} - ${e.time}`}
                          style={{
                            fontSize: '11px',
                            padding: '4px 6px',
                            backgroundColor: e.completed ? 'rgba(99, 125, 101, 0.08)' : 'var(--cream)',
                            borderLeft: e.completed ? '3px solid var(--green)' : '3px solid var(--accent)',
                            color: e.completed ? 'var(--muted)' : 'var(--ink)',
                            textDecoration: e.completed ? 'line-through' : 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: '500',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            marginBottom: '2px',
                            transition: 'var(--transition)'
                          }}
                          onClick={(evt) => {
                            evt.stopPropagation();
                            handleToggleComplete(e.id);
                          }}
                        >
                          {e.title}
                        </div>
                      ))}

                      {/* Icon indicator for mobile view */}
                      {cellEvents.length > 0 && !isWeddingDay && (
                        <div className="calendar-mobile-icon-container" style={{ display: 'none' }}>
                          <CheckSquare size={16} />
                        </div>
                      )}

                      {cellEvents.length > 2 && (
                        <div 
                          style={{
                            fontSize: '8.5px',
                            fontWeight: '600',
                            color: 'var(--gold-hover)',
                            backgroundColor: 'rgba(197, 168, 128, 0.1)',
                            padding: '2px 4px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: '2px'
                          }}
                          onClick={(evt) => {
                            evt.stopPropagation();
                            setSelectedDayEventsDate(cell.dateStr);
                          }}
                        >
                          + {cellEvents.length - 2} más
                        </div>
                      )}

                      {isWeddingDay && (
                        <>
                          <div className="wedding-sparkle s1">✨</div>
                          <div className="wedding-sparkle s2">✨</div>
                          <div className="wedding-sparkle s3">✨</div>
                          <div className="wedding-day-label">
                            ¡Nuestra Boda!
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximas Citas */}
      <div className="card dashboard-calendar-summary" style={{ width: '100%', marginTop: '24px', padding: '32px' }}>
        <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <h3 style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '4px' }}>Eventos Cosmic Love</h3>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'var(--font-sans)', display: 'block', fontStyle: 'italic' }}>
            (solicita tu invitación gratuita)
          </span>
        </div>
        <p className="section-intro" style={{ marginBottom: '20px' }}>Ven a inspirarte y conocer a los mejores proveedores cara a cara:</p>
        
        <div className="fair-events-list">
          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Valencia</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Valencia</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 27 de Septiembre, 2026</span>
              <span><strong>Lugar:</strong> Hotel Balneario Las Arenas 5* G.L.</span>
            </div>
          </div>

          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Madrid</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Madrid</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 4 de Octubre, 2026</span>
              <span><strong>Lugar:</strong> Hotel Attica 21 (Las Rozas)</span>
            </div>
          </div>

          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Zaragoza</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Zaragoza</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 4 de Octubre, 2026</span>
              <span><strong>Lugar:</strong> Espacio Ebro (Zaragoza)</span>
            </div>
          </div>

          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Vigo</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Vigo</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 25 de Octubre, 2026</span>
              <span><strong>Lugar:</strong> Hotel Attica 21 Business & Wellness</span>
            </div>
          </div>

          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Toledo</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Toledo</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 25 de Octubre, 2026</span>
              <span><strong>Lugar:</strong> Hacienda El Cardenal</span>
            </div>
          </div>

          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Castellón</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Castellón</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 1 de Noviembre, 2026</span>
              <span><strong>Lugar:</strong> El Invernadero (Castellón)</span>
            </div>
          </div>

          <div className="fair-event-card">
            <div className="fair-event-header">
              <span className="fair-event-city">Murcia</span>
              <span className="fair-badge">Boutique</span>
            </div>
            <h4 className="fair-event-title">Feria Cosmic Love Murcia</h4>
            <div className="fair-details">
              <span><strong>Fecha:</strong> Domingo, 15 de Noviembre, 2026</span>
              <span><strong>Lugar:</strong> Sercotel Amistad Murcia****</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <a href="https://cosmiclove.es/invitacion" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ minWidth: '240px' }}>
            Solicitar Invitación Feria
          </a>
        </div>
      </div>

      {/* Modal Popup para el detalle del día en el Dashboard */}
      {selectedDayEventsDate && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(26, 26, 26, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card modal-content" style={{
            maxWidth: '500px',
            width: '90%',
            padding: '28px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-medium)',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', textTransform: 'capitalize', color: 'var(--ink)' }}>
                Tareas del {new Date(selectedDayEventsDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </h3>
              <button
                onClick={() => setSelectedDayEventsDate(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--muted)', lineHeight: '1' }}
              >
                &times;
              </button>
            </div>

            <div className="day-events-modal-list" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {events.filter(e => e.date === selectedDayEventsDate).map(event => (
                <div key={event.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: event.completed ? 'rgba(99, 125, 101, 0.02)' : 'var(--cream)',
                  opacity: event.completed ? 0.8 : 1
                }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', marginTop: '2px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                    onClick={() => handleToggleComplete(event.id)}
                  >
                    {event.completed ? <CheckSquare size={18} style={{ color: 'var(--green)' }} /> : <Square size={18} />}
                  </button>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', backgroundColor: 'var(--cream-dark)', color: 'var(--muted)', padding: '2px 6px', letterSpacing: '0.05em' }}>
                        {event.category || 'Otros'}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '500' }}>
                        {event.time}
                      </span>
                    </div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--ink)',
                      textDecoration: event.completed ? 'line-through' : 'none',
                      margin: '0 0 4px 0'
                    }}>
                      {event.title}
                    </h4>
                    {event.desc && (
                      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: '1.4' }}>
                        {event.desc}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Eliminar esta tarea de la agenda?')) {
                        handleDeleteEvent(event.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', alignSelf: 'center', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedDayEventsDate(null)}
                style={{ padding: '10px 20px', fontSize: '10px' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


      <style>{`
        .dashboard-view {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header-meta {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .dot {
          color: var(--gold);
        }
        .couple-names {
          font-family: var(--font-raleway);
          font-size: 40px;
          font-weight: 700;
          letter-spacing: 0.05em;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) {
          .couple-names {
            font-size: 30px;
          }
        }
        .wedding-date-text {
          font-family: var(--font-sans);
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--accent);
        }
        
        /* Cuenta atrás */
        .countdown-section {
          background-color: var(--cream-dark);
          border: 1px solid var(--line);
          padding: 32px 20px;
          text-align: center;
          margin-bottom: 40px;
        }
        .countdown-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          max-width: 500px;
          margin: 0 auto;
        }
        .countdown-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }
        .countdown-number {
          font-family: var(--font-serif);
          font-size: 40px;
          color: var(--ink);
          line-height: 1;
        }
        .countdown-label {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 6px;
        }
        .countdown-divider {
          font-family: var(--font-serif);
          font-size: 32px;
          color: var(--accent);
          line-height: 1;
          padding-bottom: 12px;
        }
        .countdown-footer {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--ink);
          margin-top: 16px;
        }
        @media (max-width: 600px) {
          .countdown-container {
            gap: 8px;
          }
          .countdown-block {
            min-width: 60px;
          }
          .countdown-number {
            font-size: 28px;
          }
          .countdown-divider {
            font-size: 20px;
            padding-bottom: 8px;
          }
          .countdown-footer {
            font-size: 11px;
            letter-spacing: 0.15em;
          }
        }

        /* Métricas */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }
        @media (max-width: 900px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .metrics-grid > div:last-child {
            grid-column: span 2;
          }
        }
        .metric-card {
          cursor: pointer;
        }
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .metric-title {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .metric-icon {
          color: var(--accent);
          width: 22px !important;
          height: 22px !important;
        }
        .metric-value {
          font-size: 32px;
          font-family: var(--font-serif);
          color: var(--ink);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .metric-subtext {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .progress-bar {
          width: 100%;
          height: 3px;
          background-color: var(--cream);
          margin-bottom: 8px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: var(--ink);
          transition: width 0.5s ease;
        }
        .metric-percentage {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .select-accent {
          background-color: var(--cream-dark);
          border-color: var(--line);
        }
        .metric-special-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .heart-inline {
          color: var(--gold);
        }

        /* Grid inferior */
        .dashboard-grid-two {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .dashboard-grid-two {
            grid-template-columns: 1fr;
          }
        }
        .dashboard-recommendations h3, .dashboard-calendar-summary h3 {
          font-size: 22px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 12px;
        }
        .section-intro {
          font-size: 13px;
          margin-bottom: 20px;
        }
        .recommendation-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .recommendation-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px;
          border: 1px solid transparent;
          transition: var(--transition);
          cursor: pointer;
        }
        .recommendation-item:hover {
          border-color: var(--line);
          background-color: var(--cream);
        }
        .bullet-active {
          color: var(--gold);
          margin-top: 2px;
        }
        .recommendation-details {
          flex: 1;
        }
        .recommendation-details h4 {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 2px;
        }
        .recommendation-desc {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.4;
        }
        .item-arrow {
          color: var(--accent);
          align-self: center;
          opacity: 0;
          transition: var(--transition);
        }
        .recommendation-item:hover .item-arrow {
          opacity: 1;
          transform: translateX(3px);
        }

        /* Promo Feria y Próximos Eventos */
        .fair-events-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 12px;
        }
        @media (max-width: 1024px) {
          .fair-events-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .fair-events-list {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .fair-event-card {
          border-left: 2px solid var(--gold);
          padding-left: 14px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .fair-event-card.pending-event {
          border-left-color: var(--line);
          opacity: 0.85;
        }
        .fair-event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .fair-event-city {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .fair-badge {
          align-self: flex-start;
          background-color: var(--gold);
          color: var(--white);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
        }
        .fair-badge-secondary {
          background-color: var(--cream-dark);
          color: var(--muted);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
        }
        .fair-event-title {
          font-size: 15px !important;
          font-family: var(--font-serif);
          color: var(--ink);
          margin-bottom: 6px;
          font-weight: 400;
        }
        .fair-event-desc {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.4;
        }
        .fair-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: var(--ink);
          background-color: var(--cream);
          padding: 10px 12px;
          border-left: 2px solid var(--gold);
        }
        .btn-full {
          width: 100%;
          text-align: center;
          margin-top: 12px;
        }

        /* Estilos Calendario del Dashboard */
        .btn-month-nav {
          background: none;
          border: 1px solid var(--line);
          padding: 8px;
          cursor: pointer;
          color: var(--muted);
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-month-nav:hover {
          background-color: var(--cream);
          color: var(--ink);
          border-color: var(--ink);
        }
        .calendar-day-cell:hover {
          background-color: rgba(245, 240, 232, 0.05) !important;
        }
        .calendar-event-item {
          transition: var(--transition);
        }
        .calendar-event-item:hover {
          transform: translateY(-0.5px);
          box-shadow: var(--shadow-subtle);
        }

        /* Estilos del día de boda (Sparkles y Texto centrado) */
        .calendar-day-cell.wedding-day {
          background-color: rgba(197, 168, 128, 0.08) !important;
          box-shadow: inset 0 0 0 2px #d4af37 !important;
          z-index: 2;
        }
        .wedding-sparkle {
          position: absolute;
          font-size: 14px;
          pointer-events: none;
          z-index: 5;
          color: #d4af37;
        }
        .wedding-sparkle.s1 {
          top: 25px;
          left: 25%;
          animation: twinkle 1.5s infinite alternate;
        }
        .wedding-sparkle.s2 {
          top: 12px;
          left: 45%;
          font-size: 18px;
          animation: twinkle 2s infinite alternate;
        }
        .wedding-sparkle.s3 {
          top: 25px;
          right: 25%;
          animation: twinkle 1.8s infinite alternate;
        }
        @keyframes twinkle {
          0% { opacity: 0.35; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1.15); }
        }
        .wedding-day-label {
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-serif);
          font-size: 13px;
          font-weight: 700;
          color: var(--gold-hover) !important;
          text-align: center;
          white-space: nowrap;
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          z-index: 4;
          letter-spacing: 0.02em;
        }

        /* Mobile responsive overrides for the monthly calendar */
        @media (max-width: 600px) {
          .metric-card {
            padding: 16px 14px !important;
          }
          .metric-card .metric-title {
            font-size: 10px !important;
          }
          .metric-card .metric-icon {
            width: 18px !important;
            height: 18px !important;
          }
          .metric-card .metric-value {
            font-size: 20px !important;
          }
          .metric-card .metric-subtext {
            font-size: 10px !important;
            margin-bottom: 10px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .metric-card .metric-percentage {
            font-size: 9px !important;
          }
          .monthly-calendar-card {
            padding: 16px !important;
          }
          .calendar-grid {
            grid-auto-rows: 55px !important;
          }
          .calendar-day-cell {
            padding: 4px !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }
          .calendar-day-cell .day-number {
            margin-bottom: 0px !important;
            font-size: 10px !important;
            width: 16px !important;
            height: 16px !important;
          }
          .calendar-day-cell .calendar-event-item {
            display: none !important;
          }
          .calendar-day-events {
            justify-content: center !important;
            align-items: center !important;
            flex-direction: row !important;
            gap: 2px !important;
          }
          /* Highlight cells with tasks */
          .calendar-day-cell.has-events {
            background-color: rgba(197, 168, 128, 0.05) !important;
            box-shadow: inset 0 0 0 1px rgba(197, 168, 128, 0.2) !important;
          }
          .calendar-day-cell.has-events.today {
            background-color: rgba(197, 168, 128, 0.12) !important;
          }
          .calendar-mobile-icon-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: var(--gold-hover) !important;
            margin-top: 4px !important;
          }
          .calendar-day-cell.today .calendar-mobile-icon-container {
            color: var(--ink) !important;
          }
          .calendar-day-cell .wedding-day-label {
            display: none !important;
          }
          .wedding-sparkle {
            display: none !important;
          }
          .calendar-day-cell.wedding-day::after {
            content: "💍";
            font-size: 10px;
            position: absolute;
            bottom: 2px;
            right: 2px;
          }
        }
      `}</style>

      {/* Toast Notificación Éxito */}
      {saveSuccessToast && (
        <div className="toast-success-badge fade-in">
          <Check size={16} /> ¡Datos de la boda actualizados correctamente!
        </div>
      )}

      {/* Modal para Editar Datos de la Boda */}
      {isEditModalOpen && (
        <div className="edit-modal-overlay fade-in" onClick={() => setIsEditModalOpen(false)}>
          <div className="edit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <div>
                <h3 className="edit-modal-title">Modificar datos de vuestra boda</h3>
                <p className="edit-modal-subtitle">Actualiza la fecha, nombres o detalles. El portal se recalculará automáticamente.</p>
              </div>
              <button type="button" className="btn-close-modal" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWeddingData} className="edit-modal-body">
              <div className="edit-form-grid">
                <div className="edit-form-group">
                  <label className="edit-label">Tu nombre</label>
                  <div className="edit-input-wrapper">
                    <User size={15} className="edit-input-icon" />
                    <input
                      type="text"
                      className="edit-input"
                      value={editFormData.coupleName1}
                      onChange={(e) => setEditFormData({ ...editFormData, coupleName1: e.target.value })}
                      placeholder="Nombre novio/a 1"
                      required
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label className="edit-label">Nombre de tu pareja</label>
                  <div className="edit-input-wrapper">
                    <User size={15} className="edit-input-icon" />
                    <input
                      type="text"
                      className="edit-input"
                      value={editFormData.coupleName2}
                      onChange={(e) => setEditFormData({ ...editFormData, coupleName2: e.target.value })}
                      placeholder="Nombre novio/a 2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-group">
                <label className="edit-label">
                  Fecha de la boda
                </label>
                <div className="edit-input-wrapper">
                  <CalendarIcon size={15} className="edit-input-icon" />
                  <input
                    type="date"
                    className="edit-input"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    required
                  />
                </div>
                <span className="edit-help-text">
                  ✨ La fecha actualizará el contador de días y la agenda de hitos.
                </span>
              </div>

              <div className="edit-form-grid">
                <div className="edit-form-group">
                  <label className="edit-label">Ciudad / Lugar</label>
                  <div className="edit-input-wrapper">
                    <MapPin size={15} className="edit-input-icon" />
                    <input
                      type="text"
                      className="edit-input"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      placeholder="Ej. Madrid, Valencia..."
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label className="edit-label">Estilo de la boda</label>
                  <select
                    className="edit-select"
                    value={editFormData.style}
                    onChange={(e) => setEditFormData({ ...editFormData, style: e.target.value })}
                  >
                    <option value="classic">Clásico & Elegante</option>
                    <option value="boho">Boho & Rustic</option>
                    <option value="modern">Moderno & Minimalista</option>
                    <option value="romantic">Romántico & Fine Art</option>
                    <option value="rustic">Campestre & Rústico Chic</option>
                    <option value="mediterranean">Mediterráneo</option>
                    <option value="cosmic">Extra Cosmic: Nocturna</option>
                    <option value="custom">A vuestra manera</option>
                  </select>
                </div>
              </div>

              <div className="edit-form-group">
                <label className="edit-label">Presupuesto total estimado (€)</label>
                <div className="edit-input-wrapper">
                  <DollarSign size={15} className="edit-input-icon" />
                  <input
                    type="number"
                    className="edit-input"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    placeholder="35000"
                    step="500"
                  />
                </div>
              </div>

              <div className="edit-modal-footer">
                <button type="button" className="btn-cancel-edit" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save-edit">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .btn-edit-wedding-header {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          background: rgba(197, 168, 128, 0.12);
          border: 1px solid var(--gold);
          color: var(--gold-dark);
          padding: 8px 16px;
          border-radius: 20px;
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-edit-wedding-header:hover {
          background: var(--gold);
          color: #fff;
          transform: translateY(-1px);
        }

        .toast-success-badge {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: var(--ink);
          color: #fff;
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          z-index: 99999;
          border-left: 3px solid var(--gold);
        }

        .edit-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .edit-modal-card {
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        .edit-modal-header {
          padding: 24px 28px 16px 28px;
          border-bottom: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .edit-modal-title {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 500;
          color: var(--ink);
          margin: 0 0 4px 0;
        }
        .edit-modal-subtitle {
          font-size: 12px;
          color: var(--ink-light);
          margin: 0;
        }
        .btn-close-modal {
          background: transparent;
          border: none;
          color: var(--ink-light);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .btn-close-modal:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--ink);
        }
        .edit-modal-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .edit-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .edit-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .edit-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--ink);
        }
        .edit-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .edit-input-icon {
          position: absolute;
          left: 12px;
          color: var(--gold);
        }
        .edit-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--white);
          font-size: 13px;
          color: var(--ink);
          transition: border-color 0.2s;
        }
        .edit-input:focus {
          outline: none;
          border-color: var(--gold);
        }
        .edit-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--white);
          font-size: 13px;
          color: var(--ink);
        }
        .edit-help-text {
          font-size: 11px;
          color: var(--ink-light);
          font-style: italic;
          margin-top: 2px;
        }
        .edit-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }
        .btn-cancel-edit {
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: transparent;
          font-size: 13px;
          color: var(--ink-light);
          cursor: pointer;
        }
        .btn-save-edit {
          padding: 10px 22px;
          border-radius: 8px;
          border: none;
          background: var(--ink);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-save-edit:hover {
          background: var(--gold);
        }
      `}</style>
    </div>
  );
}
