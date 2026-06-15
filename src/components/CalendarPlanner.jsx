import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, Calendar as CalIcon, Clock, CheckSquare, Square, AlertCircle, HelpCircle, PlusCircle, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

const formatSuggestedDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(/-/g, '/'));
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function CalendarPlanner({ events, setEvents, weddingDate }) {
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    desc: '',
    category: 'Planificación'
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState("10-12");
  const [modalTask, setModalTask] = useState(null);
  const [selectedDayEventsDate, setSelectedDayEventsDate] = useState(null);
  
  // Calendario Navegación
  const [currentDate, setCurrentDate] = useState(() => {
    if (weddingDate) {
      const wDate = new Date(weddingDate);
      if (!isNaN(wDate.getTime())) return wDate;
    }
    return new Date();
  });

  const CATEGORIES = [
    'Esenciales',
    'Planificación',
    'Trámites matrimonio',
    'Ceremonia',
    'Banquete',
    'Flores y decoración',
    'Fotografía y vídeo',
    'Música',
    'Invitaciones',
    'Novia y Complementos',
    'Novio y Complementos',
    'Joyería',
    'Luna de miel',
    'Belleza y salud',
    'Detalles de boda',
    'Transportes',
    'Otros'
  ];

  const PLANNING_GUIDE = {
    "10-12": [
      { title: "Anuncio del enlace y estilo", desc: "Comunicar la noticia oficial a familiares y definir el estilo estético general de la boda.", category: "Planificación", monthsBefore: 11 },
      { title: "Fijación de la fecha aproximada", desc: "Establecer el día y la hora estimadas para la celebración, considerando la época del año.", category: "Planificación", monthsBefore: 11 },
      { title: "Coordinación profesional", desc: "Decidir si contaréis con una Wedding Planner para la gestión del diseño y la logística, o si lo organizaréis por vuestra cuenta.", category: "Planificación", monthsBefore: 11 },
      { title: "Borrador de invitados", desc: "Crear un listado preliminar con los acompañantes indispensables para dimensionar el catering y el espacio.", category: "Planificación", monthsBefore: 11 },
      { title: "Asignación de presupuesto", desc: "Definir el presupuesto total máximo y distribuirlo de manera aproximada entre los proveedores.", category: "Planificación", monthsBefore: 11 },
      { title: "Reserva del lugar de ceremonia", desc: "Visitar y reservar el espacio civil o religioso donde tendrá lugar el sí quiero.", category: "Ceremonia", monthsBefore: 10 },
      { title: "Elección del oficiante", desc: "Contactar con el maestro de ceremonias, juez o párroco que formalice vuestro matrimonio.", category: "Ceremonia", monthsBefore: 10 },
      { title: "Reserva del catering y finca", desc: "Firmar el contrato con el espacio principal de celebración y concretar los primeros detalles gastronómicos.", category: "Banquete", monthsBefore: 10 },
      { title: "Búsqueda de fotografía y video", desc: "Seleccionar al equipo artístico para reportaje gráfico. Los mejores profesionales suelen tener agenda muy limitada.", category: "Fotografía y vídeo", monthsBefore: 10 },
      { title: "Logística para invitados", desc: "Buscar opciones de hoteles cercanos para invitados de fuera y planificar sorpresas o animación.", category: "Planificación", monthsBefore: 10 },
      { title: "Selección de música y DJ", desc: "Reservar el DJ, equipo de iluminación o banda de música para la ceremonia y la fiesta posterior.", category: "Música", monthsBefore: 10 }
    ],
    "7-9": [
      { title: "Búsqueda del vestido de novia", desc: "Visitar ateliers de novias, probar diferentes cortes y encargar el diseño del vestido principal para las pruebas.", category: "Novia y Complementos", monthsBefore: 8 },
      { title: "Trámites matrimoniales", desc: "Iniciar la recogida de documentos oficiales (acta de nacimiento, empadronamiento, etc.) necesarios según el tipo de enlace.", category: "Trámites matrimonio", monthsBefore: 8 },
      { title: "Diseño floral y decoración", desc: "Seleccionar al equipo de floristas y coordinar la gama cromática y tipos de estructuras decorativas.", category: "Flores y decoración", monthsBefore: 8 },
      { title: "Elección de alianzas de boda", desc: "Visitar joyerías para elegir los anillos del enlace y definir las inscripciones interiores.", category: "Joyería", monthsBefore: 8 },
      { title: "Planificación de la luna de miel", desc: "Decidir el destino del viaje de novios, consultar agencias y tramitar billetes y pasaportes.", category: "Luna de miel", monthsBefore: 8 }
    ],
    "4-6": [
      { title: "Diseño de las invitaciones", desc: "Seleccionar la papelería física o terminar de configurar la invitación digital interactiva.", category: "Invitaciones", monthsBefore: 5 },
      { title: "Asignación de roles especiales", desc: "Preguntar a las personas más importantes si desean ser vuestros testigos oficiales, padrinos o damas de honor.", category: "Planificación", monthsBefore: 5 },
      { title: "Reserva de luna de miel", desc: "Confirmar las reservas finales de vuelos, hoteles y excursiones del viaje de novios.", category: "Luna de miel", monthsBefore: 5 },
      { title: "Confirmación de contactos", desc: "Actualizar la lista con direcciones físicas o correos para proceder con el envío de las invitaciones.", category: "Invitaciones", monthsBefore: 5 },
      { title: "Transporte para invitados", desc: "Reservar el coche de bodas y organizar autobuses o traslados opcionales para los invitados.", category: "Transportes", monthsBefore: 5 },
      { title: "Pruebas de peinado y estética", desc: "Reservar estilista de cabello y maquillaje, y programar las primeras sesiones de pruebas con el vestido.", category: "Belleza y salud", monthsBefore: 4 },
      { title: "Selección del traje del novio", desc: "Visitar sastrerías para definir el estilo del traje del novio, complementos y zapatos.", category: "Novio y Complementos", monthsBefore: 4 },
      { title: "Degustación de menú", desc: "Realizar la degustación de platos y elegir el menú definitivo junto con la tarta de boda.", category: "Banquete", monthsBefore: 4 },
      { title: "Elegir decoración y animación para la fiesta", desc: "Definir el estilo de la pista, cabinas de fotos, luces especiales y juegos o animación para los invitados.", category: "Flores y decoración", monthsBefore: 4 },
      { title: "¡A mirar los detallitos de boda!", desc: "Buscar y seleccionar opciones de regalos de recuerdo o detalles de boda para vuestros invitados.", category: "Detalles de boda", monthsBefore: 4 },
      { title: "Reservar el coche de boda", desc: "Buscar y contratar el transporte nupcial principal, incluyendo coche clásico, deportivo o de caballos.", category: "Transportes", monthsBefore: 4 },
      { title: "Reservar el hotel de la noche de bodas", desc: "Reservar la suite nupcial o habitación de hotel para hospedaros tras la fiesta de bodas.", category: "Otros", monthsBefore: 4 },
      { title: "Elegir el centro de peluquería y maquillaje", desc: "Seleccionar el salón o estilistas para el peinado y maquillaje del gran día.", category: "Belleza y salud", monthsBefore: 4 },
      { title: "Los vestidos de damas de honor, pajes y padrinos", desc: "Organizar y coordinar el estilismo de los acompañantes principales de la boda.", category: "Planificación", monthsBefore: 4 },
      { title: "Encargar los detallitos para los invitados", desc: "Encargar formalmente los regalos de recuerdo para los invitados del banquete.", category: "Detalles de boda", monthsBefore: 4 },
      { title: "Buscar regalos para los invitados especiales", desc: "Seleccionar y encargar detalles personalizados para testigos, padrinos y familiares directos.", category: "Detalles de boda", monthsBefore: 4 },
      { title: "Pedir hora para las pruebas de peluquería y maquillaje", desc: "Concretar las citas previas para realizar los ensayos de peinado y maquillaje.", category: "Belleza y salud", monthsBefore: 4 },
      { title: "Pedir hora en el centro de estética", desc: "Agendar tratamientos de cuidado de la piel, manicura u otros mimos antes del enlace.", category: "Belleza y salud", monthsBefore: 4 },
      { title: "Revisar los menús", desc: "Validar las opciones gastronómicas con el restaurante o catering y definir opciones especiales.", category: "Banquete", monthsBefore: 4 },
      { title: "¡Nuestra despedida de solter@!", desc: "Coordinar las fechas libres con vuestros amigos para celebrar la despedida de solteros.", category: "Otros", monthsBefore: 4 },
      { title: "Definir el programa de la ceremonia", desc: "Estructurar los discursos, lecturas, música y ritos que compondrán vuestra ceremonia.", category: "Ceremonia", monthsBefore: 4 },
      { title: "Informar a los participantes en la ceremonia sobre el programa", desc: "Enviar la escaleta y programa de la ceremonia a los familiares o amigos implicados.", category: "Ceremonia", monthsBefore: 4 },
      { title: "Decidir qué ramo vas a llevar... ¡y encargarlo!", desc: "Seleccionar el diseño, flores de temporada y encargar el ramo de novia final.", category: "Flores y decoración", monthsBefore: 4 },
      { title: "Recoger las alianzas", desc: "Ir a la joyería a retirar los anillos matrimoniales ya listos y grabados.", category: "Joyería", monthsBefore: 4 },
      { title: "¿Cuál será la banda sonora de vuestra boda?", desc: "Planificar y recopilar las canciones clave que sonarán en cada fase de la boda.", category: "Música", monthsBefore: 4 }
    ],
    "2-3": [
      { title: "Zapatos y accesorios nupciales", desc: "Completar el estilismo final con los zapatos, tocado, velo, pendientes y joyería especial.", category: "Novia y Complementos", monthsBefore: 3 },
      { title: "Detalles y lecturas de ceremonia", desc: "Elegir las lecturas, votos y música para ambientar cada momento del enlace.", category: "Ceremonia", monthsBefore: 2 },
      { title: "Encargar alianzas finales", desc: "Terminar las inscripciones y recoger los anillos en la joyería para el gran día.", category: "Joyería", monthsBefore: 2 }
    ],
    "ultimo-mes": [
      { title: "Cerrar la lista de invitados", desc: "Recopilar las respuestas de asistencia que falten y definir el listado final de invitados.", category: "Planificación", daysBefore: 20 },
      { title: "Revisar la organización de las mesas", desc: "Hacer la distribución definitiva de los invitados en las mesas con los confirmados reales.", category: "Banquete", daysBefore: 15 },
      { title: "Entregar al restaurante el plano de las mesas", desc: "Enviar el plano de distribución de mesas final, alergias e intolerancias al banquete.", category: "Banquete", daysBefore: 10 },
      { title: "Últimas instrucciones a los invitados", desc: "Compartir con los invitados información útil como horarios de autobuses, ubicación o código de vestimenta.", category: "Planificación", daysBefore: 8 },
      { title: "Última prueba del vestido", desc: "Realizar la última sesión de ajustes del vestido de novia con zapatos y complementos.", category: "Novia y Complementos", daysBefore: 7 },
      { title: "Recoger el traje de novio", desc: "Retirar el traje de novio de la sastrería, comprobando que todo quede a la perfección.", category: "Novio y Complementos", daysBefore: 5 },
      { title: "Revisar la documentación para el viaje", desc: "Comprobar pasaportes, billetes, reservas de hotel y seguros para la luna de miel.", category: "Luna de miel", daysBefore: 4 }
    ],
    "2-semanas": [
      { title: "Pedir hora en la peluquería para el novio", desc: "Reservar y acudir al corte de pelo o arreglo de barba para el novio antes de la boda.", category: "Belleza y salud", daysBefore: 10 },
      { title: "Última visita al centro de estética", desc: "Realizar tratamientos faciales finales, manicura o pedicura de cara al enlace.", category: "Belleza y salud", daysBefore: 8 }
    ],
    "ultima-semana": [
      { title: "Recoger el vestido de novia", desc: "Retirar el vestido de novia planchado y en perfectas condiciones del taller.", category: "Novia y Complementos", daysBefore: 4 },
      { title: "Últimos cambios en la lista de invitados", desc: "Gestionar los ajustes o imprevistos de última hora en el listado de asistentes.", category: "Planificación", daysBefore: 3 },
      { title: "Comprobar que todo está bajo control", desc: "Repasar las gestiones y el timing final con los principales proveedores de la boda.", category: "Planificación", daysBefore: 2 },
      { title: "Preparar la maleta para la noche de bodas", desc: "Dejar lista la maleta con el vestuario e higiene para vuestro alojamiento tras el banquete.", category: "Luna de miel", daysBefore: 2 }
    ],
    "ultimo-dia": [
      { title: "Recoger el ramo", desc: "Recoger en floristería o recibir en casa el ramo de novia fresco.", category: "Flores y decoración", daysBefore: 1 },
      { title: "¡A relajarse y disfrutar!", desc: "Desconectar de las llamadas de organización, descansar adecuadamente y disfrutar de vuestra víspera.", category: "Belleza y salud", daysBefore: 1 }
    ],
    "despues-boda": [
      { title: "Dejar una opinión sobre los proveedores de vuestra boda", desc: "Escribir reseñas y valoraciones de los proveedores en agradecimiento a su labor.", category: "Otros", daysBefore: -10 },
      { title: "Subir la crónica de vuestra boda", desc: "Redactar y compartir un resumen del día B con vuestras fotos favoritas del enlace.", category: "Otros", daysBefore: -15 },
      { title: "Enviar tarjetas de agradecimiento a los invitados", desc: "Enviar mensajes o postales físicas agradeciendo la compañía y obsequios recibidos.", category: "Invitaciones", daysBefore: -20 }
    ]
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;

    const event = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      date: newEvent.date,
      time: newEvent.time || 'Todo el día',
      desc: newEvent.desc.trim(),
      category: newEvent.category,
      completed: false
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      desc: '',
      category: 'Planificación'
    });
  };

  const handleAddGuideTask = (task) => {
    if (events.some(e => e.title.toLowerCase() === task.title.toLowerCase())) {
      alert("Esta tarea ya está en tu agenda.");
      return;
    }

    const suggestedDate = calculateSuggestedDate(task);

    setModalTask({
      title: task.title,
      desc: task.desc,
      category: task.category,
      date: suggestedDate,
      suggestedDate: suggestedDate,
      isDefaultDate: true
    });
  };

  const calculateSuggestedDate = (task) => {
    if (!weddingDate) return new Date().toISOString().split('T')[0];
    const date = new Date(weddingDate);
    const now = new Date();
    
    if (task.monthsBefore !== undefined) {
      date.setMonth(date.getMonth() - task.monthsBefore);
    } else if (task.daysBefore !== undefined) {
      date.setDate(date.getDate() - task.daysBefore);
    }
    
    if (date < now) {
      return now.toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleToggleComplete = (id) => {
    setEvents(events.map(e => {
      if (e.id === id) {
        return { ...e, completed: !e.completed };
      }
      return e;
    }));
  };

  // Ordenar por fecha
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const completedCount = events.filter(e => e.completed).length;
  const pendingCount = events.filter(e => !e.completed).length;

  const getEventsByMonth = () => {
    const groups = {};
    sortedEvents.forEach(event => {
      if (!event.date) return;
      const dateObj = new Date(event.date);
      const monthYear = dateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
      
      if (!groups[capitalized]) {
        groups[capitalized] = [];
      }
      groups[capitalized].push(event);
    });
    return groups;
  };

  const groupedEvents = getEventsByMonth();

  // Lógica de Calendario Mensual
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

  return (
    <div className="calendar-view fade-in">
      <div className="calendar-header-box">
        <h2>Agenda y tareas</h2>
        <p>Hitos indispensables y citas programadas.</p>
      </div>

      <div className="calendar-layout-stacked">
        {/* Tier 1: Planificador Cronológico - ANCHO COMPLETO */}
        <div className="card timeline-card full-width-card" style={{ marginBottom: '24px' }}>
          <div className="timeline-header">
            <h3>Planificador Cronológico</h3>
            <div className="timeline-stats">
              <span className="stat-pill pending">{pendingCount} Pendientes</span>
              <span className="stat-pill completed">{completedCount} Hechas</span>
            </div>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="empty-state">
              <p>No tenéis tareas o eventos en vuestra agenda. Cread la primera cita o hito abajo.</p>
            </div>
          ) : (
            <div className="timeline" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(groupedEvents).map(([monthLabel, monthEvents]) => (
                <div key={monthLabel} className="timeline-month-group">
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--gold-hover)',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '6px',
                    marginBottom: '14px',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CalIcon size={14} /> {monthLabel}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {monthEvents.map((event) => {
                      const isOverdue = new Date(event.date) < new Date() && !event.completed;
                      return (
                        <div key={event.id} className={`timeline-item ${event.completed ? 'completed' : ''}`}>
                          <button
                            type="button"
                            className="timeline-check-btn"
                            onClick={() => handleToggleComplete(event.id)}
                          >
                            {event.completed ? (
                              <CheckSquare size={18} className="icon-checked" />
                            ) : (
                              <Square size={18} className="icon-unchecked" />
                            )}
                          </button>

                          <div className="timeline-content">
                            <div className="timeline-meta">
                              <span className="timeline-date">
                                <CalIcon size={11} className="inline-icon" /> {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                              </span>
                              <span className="timeline-time">
                                <Clock size={11} className="inline-icon" /> {event.time}
                              </span>
                              {event.category && (
                                <span className="event-category-badge">
                                  <Tag size={9} className="inline-icon" /> {event.category}
                                </span>
                              )}
                              {isOverdue && (
                                <span className="overdue-badge">
                                  <AlertCircle size={10} /> Retrasado
                                </span>
                              )}
                            </div>
                            <h4 className="timeline-title" style={{ fontSize: '14px', fontWeight: '600', margin: '4px 0' }}>{event.title}</h4>
                            {event.desc && <p className="timeline-desc" style={{ margin: 0 }}>{event.desc}</p>}
                          </div>

                          <button
                            type="button"
                            className="btn-delete-event"
                            onClick={() => handleDeleteEvent(event.id)}
                            title="Eliminar de la agenda"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tier 2: Formulario de Adición + Guía recomendada */}
        <div className="middle-row-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', alignItems: 'stretch' }}>
          {/* Lado Izquierdo: Programar Citas */}
          <div className="card add-event-card">
            <h3>Añadir Cita / Hito</h3>
            <form onSubmit={handleAddEvent} className="event-form">
              <div className="form-group">
                <label className="form-label">Título de la Cita o Tarea</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Prueba de menú, Contrato Fotógrafo..."
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                  className="form-control"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción o Notas</label>
                <textarea
                  className="form-control"
                  placeholder="Añadir notas importantes, teléfonos de contacto o ideas..."
                  rows={3}
                  value={newEvent.desc}
                  onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <Plus size={14} /> Programar Tarea
              </button>
            </form>
          </div>

          {/* Lado Derecho: Guía de Tiempos */}
          <div className="card guide-card">
            <h3>Guía de Tiempos Cosmic Love</h3>
            <p className="guide-intro" style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px', lineHeight: '1.4' }}>
              Tareas y plazos clave recomendados por expertos para organizar vuestra boda sin perder la calma.
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Plazo de Planificación</label>
              <select
                className="form-control"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                style={{ fontSize: '12px', height: '36px', padding: '6px 12px' }}
              >
                <option value="10-12">De 10 a 12 meses antes</option>
                <option value="7-9">De 7 a 9 meses antes</option>
                <option value="4-6">De 4 a 6 meses antes</option>
                <option value="2-3">De 2 a 3 meses antes</option>
                <option value="ultimo-mes">Último mes</option>
                <option value="2-semanas">2 Semanas</option>
                <option value="ultima-semana">Última semana</option>
                <option value="ultimo-dia">Último día</option>
                <option value="despues-boda">Después de la boda</option>
              </select>
            </div>

            <div className="guide-tasks-list">
              {(() => {
                const filteredTasks = PLANNING_GUIDE[selectedTimeframe].filter(
                  task => !events.some(e => e.title.trim().toLowerCase() === task.title.trim().toLowerCase())
                );
                
                if (filteredTasks.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: '12.5px', fontStyle: 'italic', backgroundColor: 'var(--cream)', border: '1px dashed var(--line)' }}>
                      ✨ ¡Todas las tareas de este plazo ya están en tu agenda!
                    </div>
                  );
                }
                
                return filteredTasks.map((task, idx) => (
                  <div key={idx} className="guide-task-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'var(--cream)', border: '1px solid var(--line)', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'block', lineHeight: '1.4' }}>
                        <span className="guide-task-title" style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--ink)', marginRight: '6px', wordBreak: 'break-word' }} title={task.title}>
                          {task.title}
                        </span>
                        
                        {/* Tooltip con información */}
                        <div className="tooltip-container" style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                          <HelpCircle size={13} style={{ color: 'var(--accent)', cursor: 'help', display: 'block' }} />
                          <span className="tooltip-text">
                            <strong>[{task.category}]</strong><br />
                            {task.desc}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span className="event-category-badge" style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', backgroundColor: 'var(--cream-dark)', color: 'var(--muted)', padding: '2px 6px', letterSpacing: '0.05em' }}>
                          {task.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-add-guide-task"
                      title="Añadir a la agenda"
                      onClick={() => handleAddGuideTask(task)}
                      style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', transition: 'var(--transition)', flexShrink: 0 }}
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Tier 3: Calendario Nupcial - ANCHO COMPLETO */}
        <div className="card monthly-calendar-card full-width-card">
          <div className="calendar-month-nav">
            <button onClick={handlePrevMonth} className="btn-month-nav"><ChevronLeft size={16}/></button>
            <h3>
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={handleNextMonth} className="btn-month-nav"><ChevronRight size={16}/></button>
          </div>

          <div className="calendar-grid-header">
            {dayNames.map(day => (
              <span key={day} className="calendar-header-day">
                {day}
              </span>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarCells.map((cell, idx) => {
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
              const isWeddingDay = weddingDate === cell.dateStr;
              const cellEvents = cell.dateStr ? events.filter(e => e.date === cell.dateStr) : [];
              
              return (
                <div
                  key={idx}
                  className={`calendar-day-cell ${!cell.day ? 'empty' : ''} ${isToday ? 'today' : ''} ${isWeddingDay ? 'wedding-day' : ''} ${cell.day && cellEvents.length > 0 ? 'has-events' : ''}`}
                  onClick={() => cell.day && cellEvents.length > 0 && setSelectedDayEventsDate(cell.dateStr)}
                >
                  {cell.day && (
                    <>
                      <span className="day-number">
                        {cell.day}
                      </span>

                      <div className="calendar-day-events">
                        {cellEvents.slice(0, 3).map(e => (
                          <div
                            key={e.id}
                            className={`calendar-event-item ${e.completed ? 'completed' : ''}`}
                            title={`[${e.category}] ${e.title} - ${e.time}`}
                            onClick={(evt) => {
                              evt.stopPropagation(); // Prevents opening the day modal
                              handleToggleComplete(e.id);
                            }}
                          >
                            {e.title}
                          </div>
                        ))}

                        {cellEvents.length > 3 && (
                          <div 
                            className="more-events-indicator"
                            onClick={(evt) => {
                              evt.stopPropagation();
                              setSelectedDayEventsDate(cell.dateStr);
                            }}
                          >
                            + {cellEvents.length - 3} más
                          </div>
                        )}

                        {isWeddingDay && (
                          <div className="wedding-day-label">
                            💍 ¡Boda!
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Popup para programar tarea sugerida con fecha manual */}
      {modalTask && createPortal(
        <div className="modal-overlay" style={{ zIndex: 999 }}>
          <div className="card modal-content" style={{
            maxWidth: '450px',
            width: '95%',
            padding: '28px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-medium)',
            borderRadius: 0,
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              Programar Tarea Sugerida
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px', lineHeight: '1.4' }}>
              Ajusta la fecha sugerida según los tiempos de planificación antes de añadir este hito a tu agenda.
            </p>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <span className="form-label" style={{ fontSize: '9px', fontWeight: '700' }}>Tarea</span>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--ink)', padding: '10px 12px', backgroundColor: 'var(--cream)', border: '1px solid var(--line)' }}>
                {modalTask.title}
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <span className="form-label" style={{ fontSize: '9px', fontWeight: '700' }}>Categoría</span>
              <span className="event-category-badge" style={{ display: 'inline-flex', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', backgroundColor: 'var(--cream-dark)', color: 'var(--muted)', padding: '4px 8px', letterSpacing: '0.05em' }}>
                <Tag size={9} className="inline-icon" /> {modalTask.category}
              </span>
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '9px', fontWeight: '700' }}>Fecha Programada</label>
              <input
                type="date"
                className="form-control"
                value={modalTask.date}
                onChange={(e) => setModalTask({ 
                  ...modalTask, 
                  date: e.target.value,
                  isDefaultDate: false
                })}
                required
                style={{ 
                  fontSize: '13px', 
                  padding: '10px 12px',
                  color: modalTask.isDefaultDate ? 'var(--gold-hover)' : 'var(--ink)',
                  borderColor: modalTask.isDefaultDate ? 'var(--gold)' : 'var(--line)',
                  fontWeight: modalTask.isDefaultDate ? '600' : 'normal',
                  transition: 'var(--transition)'
                }}
              />
              {modalTask.isDefaultDate ? (
                <span style={{ fontSize: '11px', color: 'var(--gold-hover)', marginTop: '6px', display: 'block' }}>
                  💡 Sugerencia: {formatSuggestedDate(modalTask.suggestedDate)} (puedes cambiarla)
                </span>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', display: 'block' }}>
                  ✓ Ajustada por ti (Sugerencia original: {formatSuggestedDate(modalTask.suggestedDate)})
                </span>
              )}
            </div>

            {modalTask.desc && (
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <span className="form-label" style={{ fontSize: '9px', fontWeight: '700' }}>Descripción</span>
                <p style={{ fontSize: '12px', lineHeight: '1.4', color: 'var(--muted)', margin: 0 }}>
                  {modalTask.desc}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalTask(null)}
                style={{ padding: '10px 20px', fontSize: '10px', height: '38px' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (!modalTask.date) {
                    alert("Por favor, selecciona una fecha.");
                    return;
                  }
                  const event = {
                    id: Date.now().toString(),
                    title: modalTask.title,
                    date: modalTask.date,
                    time: 'Todo el día',
                    desc: modalTask.desc || '',
                    category: modalTask.category,
                    completed: false
                  };
                  setEvents([...events, event]);
                  setModalTask(null);
                }}
                style={{ padding: '10px 20px', fontSize: '10px', height: '38px' }}
              >
                Añadir a la Agenda
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Popup para mostrar la lista completa de tareas de un día al hacer clic en el calendario */}
      {selectedDayEventsDate && createPortal(
        <div className="modal-overlay" style={{ zIndex: 998 }}>
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
        </div>,
        document.body
      )}

      <style>{`
        .calendar-view {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        @media (max-width: 600px) {
          .calendar-view {
            padding: 16px 12px;
          }
          .calendar-view .card {
            padding: 16px !important;
          }
          .guide-task-item {
            padding: 8px 10px !important;
            gap: 8px !important;
          }
        }
        .calendar-header-box {
          margin-bottom: 32px;
        }
        .calendar-header-box h2 {
          font-size: 32px;
          margin-bottom: 6px;
        }

        .calendar-layout-stacked {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .full-width-card {
          width: 100%;
        }
        @media (max-width: 900px) {
          .middle-row-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .timeline-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .timeline-item {
            padding: 12px !important;
            gap: 10px !important;
          }
          .timeline-meta {
            gap: 6px 10px !important;
          }
          .btn-delete-event {
            padding: 4px !important;
          }
        }

        /* Timeline Card */
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--line);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .timeline-stats {
          display: flex;
          gap: 8px;
        }
        .stat-pill {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 3px 8px;
          letter-spacing: 0.05em;
        }
        .stat-pill.pending {
          background-color: var(--cream-dark);
          color: var(--ink);
        }
        .stat-pill.completed {
          background-color: rgba(99, 125, 101, 0.1);
          color: var(--green);
        }

        /* Timeline list */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border: 1px solid var(--line);
          background-color: var(--white);
          transition: var(--transition);
        }
        .timeline-item:hover {
          border-color: var(--accent);
          background-color: rgba(245, 240, 232, 0.1);
        }
        .timeline-item.completed {
          border-color: var(--line);
          background-color: rgba(99, 125, 101, 0.01);
          opacity: 0.75;
        }
        .timeline-check-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          margin-top: 2px;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .timeline-check-btn:hover {
          color: var(--ink);
        }
        .icon-checked {
          color: var(--green);
        }
        .timeline-content {
          flex: 1;
          min-width: 0;
        }
        .timeline-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          font-size: 10px;
          font-weight: 500;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .overdue-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background-color: rgba(162, 95, 95, 0.1);
          color: var(--red);
          padding: 2px 6px;
          font-size: 9px;
          font-weight: 600;
        }
        .event-category-badge {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          background-color: var(--cream-dark);
          color: var(--muted);
          padding: 2px 6px;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .timeline-title {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .timeline-item.completed .timeline-title {
          text-decoration: line-through;
          color: var(--muted);
        }
        .timeline-desc {
          font-size: 12px;
          line-height: 1.4;
        }
        .btn-delete-event {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          transition: var(--transition);
          margin-top: 2px;
          flex-shrink: 0;
        }
        .btn-delete-event:hover {
          color: var(--red);
        }
        .inline-icon {
          display: inline;
          vertical-align: middle;
          margin-right: 2px;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
        }

        /* Formulario e Items */
        .add-event-card h3, .guide-card h3 {
          font-size: 20px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .event-form {
          display: flex;
          flex-direction: column;
        }
        .guide-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 445px;
          overflow-y: auto;
          padding-right: 4px;
        }
        @media (max-width: 900px) {
          .guide-tasks-list {
            height: auto !important;
            max-height: none !important;
            overflow-y: visible !important;
          }
        }

        /* Month nav */
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

        /* Tooltip de Información */
        .tooltip-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: help;
        }
        .tooltip-text {
          visibility: hidden;
          width: 220px;
          background-color: var(--ink);
          color: var(--cream);
          text-align: left;
          border-radius: 2px;
          padding: 8px 12px;
          position: absolute;
          z-index: 100;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 11px;
          font-family: var(--font-sans);
          line-height: 1.4;
          box-shadow: var(--shadow-medium);
          pointer-events: none;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
        }
        .tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: var(--ink) transparent transparent transparent;
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        .btn-add-guide-task:hover {
          color: var(--gold-hover) !important;
          transform: scale(1.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(26, 26, 26, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Estilos del Calendario Mensual */
        .monthly-calendar-card {
          padding: 32px;
        }
        .calendar-month-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 16px;
        }
        .calendar-month-nav h3 {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 500;
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .calendar-grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 8px;
        }
        .calendar-header-day {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 8px 0;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-auto-rows: 120px;
          border-top: 1px solid var(--line);
          border-left: 1px solid var(--line);
        }
        .calendar-day-cell {
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          padding: 8px;
          background-color: var(--white);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
          z-index: 1;
          cursor: default;
          transition: var(--transition);
        }
        .calendar-day-cell.empty {
          background-color: rgba(245, 240, 232, 0.2);
        }
        .calendar-day-cell.wedding-day {
          background-color: rgba(197, 168, 128, 0.08);
          box-shadow: inset 0 0 0 2px var(--gold);
          z-index: 2;
        }
        .calendar-day-cell.has-events {
          cursor: pointer;
        }
        .calendar-day-cell.has-events:hover {
          background-color: rgba(245, 240, 232, 0.3);
        }
        .day-number {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: transparent;
          transition: var(--transition);
        }
        .calendar-day-cell.wedding-day .day-number {
          color: var(--gold-hover);
        }
        .calendar-day-cell.today .day-number {
          background-color: var(--cream-dark);
          color: var(--ink);
        }
        .calendar-day-events {
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
          flex: 1;
        }
        .calendar-event-item {
          font-size: 9px;
          padding: 2px 4px;
          background-color: var(--cream);
          border-left: 2px solid var(--accent);
          color: var(--ink);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .calendar-event-item.completed {
          background-color: rgba(99, 125, 101, 0.08);
          border-left-color: var(--green);
          color: var(--muted);
          text-decoration: line-through;
        }
        .more-events-indicator {
          font-size: 8.5px;
          font-weight: 600;
          color: var(--gold-hover);
          background-color: rgba(197, 168, 128, 0.1);
          padding: 2px 4px;
          text-align: center;
          cursor: pointer;
          border-radius: 2px;
          transition: var(--transition);
        }
        .more-events-indicator:hover {
          background-color: rgba(197, 168, 128, 0.2);
        }
        .wedding-day-label {
          font-family: var(--font-serif);
          font-size: 9px;
          font-weight: 600;
          color: var(--gold-hover);
          text-align: center;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background-color: var(--white);
          border: 1px solid var(--gold);
          padding: 3px 2px;
          width: 100%;
          box-shadow: var(--shadow-subtle);
        }

        /* Adaptación responsiva del calendario mensual en móvil */
        @media (max-width: 768px) {
          .monthly-calendar-card {
            padding: 16px;
          }
          .calendar-month-nav h3 {
            font-size: 16px;
          }
          .calendar-grid {
            border-top: none;
            border-left: none;
            grid-auto-rows: auto;
            gap: 8px;
            padding: 4px;
          }
          .calendar-grid-header {
            margin-bottom: 12px;
          }
          .calendar-day-cell {
            border-right: none;
            border-bottom: none;
            aspect-ratio: 1;
            height: auto;
            border-radius: 50%;
            padding: 4px;
            justify-content: center;
            align-items: center;
            background-color: transparent;
          }
          .calendar-day-cell:not(.empty):hover {
            background-color: var(--cream-dark);
          }
          .calendar-day-cell.empty {
            background-color: transparent;
            pointer-events: none;
          }
          .calendar-day-cell.today {
            background-color: var(--cream-dark);
          }
          .calendar-day-cell.wedding-day {
            background-color: rgba(197, 168, 128, 0.15);
            box-shadow: 0 0 0 2px var(--gold);
          }
          .day-number {
            margin-bottom: 2px;
            font-size: 13px;
            font-weight: 500;
            color: var(--ink);
            width: auto;
            height: auto;
            background-color: transparent;
          }
          .calendar-day-cell.today .day-number {
            font-weight: 700;
          }
          .calendar-day-cell.wedding-day .day-number {
            color: var(--gold-hover);
            font-weight: 700;
          }
          .wedding-day-label {
            display: none;
          }
          .calendar-day-events {
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 3px;
            margin-top: 2px;
            height: 6px;
            overflow: visible;
          }
          .calendar-event-item {
            width: 5px;
            height: 5px;
            min-height: 5px;
            border-radius: 50%;
            padding: 0;
            margin: 0;
            border: none;
            font-size: 0;
            line-height: 0;
            text-indent: -9999px;
            overflow: hidden;
            display: inline-block;
            flex-shrink: 0;
          }
          .calendar-event-item.completed {
            background-color: var(--green);
          }
          .calendar-event-item:not(.completed) {
            background-color: var(--gold);
          }
          .more-events-indicator {
            display: none;
          }
          .modal-overlay {
            align-items: center !important;
            padding: 12px !important;
            overflow-y: auto !important;
          }
          .modal-content {
            margin: 0 auto !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
