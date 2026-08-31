import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  MessageSquare, Trash2, CheckCircle2, AlertTriangle, 
  Lightbulb, HelpCircle, Loader2, Users, Calendar, 
  ChevronDown, ChevronRight 
} from 'lucide-react';

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | bug | improvement | question
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // User stats states
  const [activeTab, setActiveTab] = useState('feedback'); // feedback | users
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [chartDays, setChartDays] = useState(7); // 7 | 14 | 30
  const [expandedDays, setExpandedDays] = useState({}); // { [dateStr]: boolean }

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFeedbackList(data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('No se pudo cargar la lista de feedback. Asegúrate de haber ejecutado las políticas RLS de Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('weddings')
        .select('couple_name1, couple_name2, city, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsersList(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError('No se pudo cargar la lista de usuarios. Asegúrate de que los administradores tengan permisos de lectura en la tabla weddings.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres marcar este comentario como resuelto y eliminarlo de la lista?')) return;
    
    setDeletingId(id);
    try {
      const { error: deleteError } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setFeedbackList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Error al eliminar el feedback.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'feedback') {
      fetchFeedback();
    } else {
      fetchUsers();
    }
  };

  const filteredList = feedbackList.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getBadgeType = (type) => {
    switch (type) {
      case 'bug':
        return {
          label: 'Fallo / Error',
          className: 'badge-bug',
          icon: <AlertTriangle size={12} />
        };
      case 'improvement':
        return {
          label: 'Mejora / Idea',
          className: 'badge-improvement',
          icon: <Lightbulb size={12} />
        };
      case 'question':
        return {
          label: 'Duda',
          className: 'badge-question',
          icon: <HelpCircle size={12} />
        };
      default:
        return {
          label: 'Feedback',
          className: 'badge-default',
          icon: <MessageSquare size={12} />
        };
    }
  };

  const counts = {
    all: feedbackList.length,
    bug: feedbackList.filter(i => i.type === 'bug').length,
    improvement: feedbackList.filter(i => i.type === 'improvement').length,
    question: feedbackList.filter(i => i.type === 'question').length,
  };

  // Group users by date (YYYY-MM-DD local date)
  const groupedUsers = useMemo(() => {
    const groups = {};
    usersList.forEach(user => {
      if (!user.created_at) return;
      const date = new Date(user.created_at);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(user);
    });
    return groups;
  }, [usersList]);

  // Today stats
  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const todayCount = useMemo(() => {
    return groupedUsers[todayKey]?.length || 0;
  }, [groupedUsers, todayKey]);

  // This month stats
  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return usersList.filter(u => {
      if (!u.created_at) return false;
      const d = new Date(u.created_at);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }).length;
  }, [usersList]);

  // Daily average
  const dailyAverage = useMemo(() => {
    if (usersList.length === 0) return 0;
    let minDate = new Date();
    usersList.forEach(u => {
      if (!u.created_at) return;
      const d = new Date(u.created_at);
      if (d < minDate) minDate = d;
    });
    const diffTime = Math.abs(new Date() - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return (usersList.length / diffDays).toFixed(1);
  }, [usersList]);

  // Peak registrations in a single day
  const peakDayCount = useMemo(() => {
    const counts = Object.values(groupedUsers).map(arr => arr.length);
    return counts.length > 0 ? Math.max(...counts) : 1;
  }, [groupedUsers]);

  // Generate timeline for chart (last N days)
  const timelineData = useMemo(() => {
    const timeline = [];
    const now = new Date();
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      const dayUsers = groupedUsers[dateKey] || [];
      const label = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      
      timeline.push({
        dateKey,
        label,
        count: dayUsers.length,
        users: dayUsers
      });
    }
    return timeline;
  }, [groupedUsers, chartDays]);

  const maxChartCount = useMemo(() => {
    const counts = timelineData.map(d => d.count);
    return Math.max(...counts, 1);
  }, [timelineData]);

  const sortedDatesWithRegistrations = useMemo(() => {
    return Object.keys(groupedUsers).sort((a, b) => b.localeCompare(a));
  }, [groupedUsers]);

  const toggleExpandDay = (dateStr) => {
    setExpandedDays(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const isRefreshing = activeTab === 'feedback' ? loading : loadingUsers;

  return (
    <div className="admin-feedback-container fade-in">
      <div className="admin-header">
        <div className="title-section">
          <h2>Panel de Administración</h2>
          <p className="subtitle">
            {activeTab === 'feedback' 
              ? 'Administración y revisión de sugerencias enviadas por las novias' 
              : 'Estadísticas y control del flujo de registros en la webapp'}
          </p>
        </div>
        
        <button 
          className="btn btn-secondary btn-refresh" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? <Loader2 className="animate-spin" size={14} /> : 'Actualizar Datos'}
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-nav">
        <button 
          className={`admin-tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <MessageSquare size={15} />
          <span>Feedback</span>
          <span className="tab-badge">{counts.all}</span>
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={15} />
          <span>Usuarios por Día</span>
          {usersList.length > 0 && <span className="tab-badge gold-badge">{usersList.length}</span>}
        </button>
      </div>

      {/* TAB CONTENT: FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="tab-content-wrapper">
          {/* Tarjetas Métricas */}
          <div className="feedback-metrics-grid">
            <div className={`metric-card-lite ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              <div className="metric-info">
                <span className="metric-title">Todos</span>
                <span className="metric-value">{counts.all}</span>
              </div>
            </div>
            <div className={`metric-card-lite border-bug ${filter === 'bug' ? 'active' : ''}`} onClick={() => setFilter('bug')}>
              <div className="metric-info">
                <span className="metric-title">Errores</span>
                <span className="metric-value text-bug">{counts.bug}</span>
              </div>
            </div>
            <div className={`metric-card-lite border-improvement ${filter === 'improvement' ? 'active' : ''}`} onClick={() => setFilter('improvement')}>
              <div className="metric-info">
                <span className="metric-title">Mejoras</span>
                <span className="metric-value text-gold">{counts.improvement}</span>
              </div>
            </div>
            <div className={`metric-card-lite border-question ${filter === 'question' ? 'active' : ''}`} onClick={() => setFilter('question')}>
              <div className="metric-info">
                <span className="metric-title">Dudas</span>
                <span className="metric-value text-question">{counts.question}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <AlertTriangle size={18} />
              <div className="error-message">
                <strong>Atención:</strong> {error}
                <div className="sql-instructions">
                  <p>Ejecuta el siguiente código en el SQL Editor de tu Supabase para dar permisos:</p>
                  <code>{`CREATE POLICY "Admins can select feedback" ON public.feedback FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = 'test@example.com' OR auth.jwt() ->> 'email' = 'labodadecloe@gmail.com' OR auth.jwt() ->> 'email' LIKE '%@cosmiclove.es');
CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = 'test@example.com' OR auth.jwt() ->> 'email' = 'labodadecloe@gmail.com' OR auth.jwt() ->> 'email' LIKE '%@cosmiclove.es');`}</code>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <Loader2 className="animate-spin text-gold" size={36} />
              <p>Cargando comentarios de las usuarias...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="empty-state card">
              <CheckCircle2 size={48} className="text-gold" />
              <h3>No hay feedback para mostrar</h3>
              <p>Los comentarios resueltos o las sugerencias filtradas aparecerán aquí una vez que las novias las envíen.</p>
            </div>
          ) : (
            <div className="feedback-list">
              {filteredList.map((item) => {
                const badge = getBadgeType(item.type);
                const dateStr = new Date(item.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={item.id} className="feedback-item-card card">
                    <div className="feedback-item-header">
                      <div className="feedback-meta">
                        <span className={`feedback-badge ${badge.className}`}>
                          {badge.icon} {badge.label}
                        </span>
                        <span className="feedback-date">{dateStr}</span>
                      </div>
                      
                      <button 
                        className="btn-resolve-feedback"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        title="Marcar como resuelto"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <>
                            <Trash2 size={14} />
                            <span>Resolver</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="feedback-message">{item.message}</p>

                    <div className="feedback-user-info">
                      <span className="user-email-label">Enviado por:</span>{' '}
                      <span className="user-email-value">{item.user_email || 'Anónimo'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: USER STATS */}
      {activeTab === 'users' && (
        <div className="tab-content-wrapper fade-in">
          {/* Tarjetas Métricas */}
          <div className="feedback-metrics-grid">
            <div className="metric-card-lite clickable-disabled">
              <div className="metric-info">
                <span className="metric-title">Total Usuarios</span>
                <span className="metric-value text-gold">{usersList.length}</span>
              </div>
            </div>
            <div className="metric-card-lite clickable-disabled">
              <div className="metric-info">
                <span className="metric-title">Registros Hoy</span>
                <span className="metric-value text-gold">{todayCount}</span>
              </div>
            </div>
            <div className="metric-card-lite clickable-disabled">
              <div className="metric-info">
                <span className="metric-title">Registros este Mes</span>
                <span className="metric-value text-gold">{thisMonthCount}</span>
              </div>
            </div>
            <div className="metric-card-lite clickable-disabled">
              <div className="metric-info">
                <span className="metric-title">Media Diaria</span>
                <span className="metric-value text-gold">{dailyAverage} <span className="text-unit">u/día</span></span>
              </div>
            </div>
          </div>

          {usersError && (
            <div className="error-alert">
              <AlertTriangle size={18} />
              <div className="error-message">
                <strong>Atención:</strong> {usersError}
                <div className="sql-instructions">
                  <p>Si la tabla weddings no permite lecturas por administradores, ejecuta esta política en Supabase:</p>
                  <code>{`CREATE POLICY "Admins can select all weddings" ON public.weddings FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = 'test@example.com' OR auth.jwt() ->> 'email' = 'labodadecloe@gmail.com' OR auth.jwt() ->> 'email' LIKE '%@cosmiclove.es');`}</code>
                </div>
              </div>
            </div>
          )}

          {loadingUsers ? (
            <div className="loading-state">
              <Loader2 className="animate-spin text-gold" size={36} />
              <p>Obteniendo estadísticas de registro...</p>
            </div>
          ) : usersList.length === 0 ? (
            <div className="empty-state card">
              <Users size={48} className="text-gold" />
              <h3>No hay usuarios registrados</h3>
              <p>Una vez que las usuarias completen su onboarding, verás las estadísticas de registro aquí.</p>
            </div>
          ) : (
            <div className="users-dashboard-layout">
              {/* Gráfico Card */}
              <div className="chart-card card">
                <div className="chart-card-header">
                  <h3>Flujo de Registros</h3>
                  <div className="chart-controls">
                    <button className={`chart-control-btn ${chartDays === 7 ? 'active' : ''}`} onClick={() => setChartDays(7)}>7 Días</button>
                    <button className={`chart-control-btn ${chartDays === 14 ? 'active' : ''}`} onClick={() => setChartDays(14)}>14 Días</button>
                    <button className={`chart-control-btn ${chartDays === 30 ? 'active' : ''}`} onClick={() => setChartDays(30)}>30 Días</button>
                  </div>
                </div>

                <div className="custom-chart-container">
                  <div className="chart-y-axis">
                    <span>{Math.round(maxChartCount)}</span>
                    <span>{Math.round(maxChartCount / 2)}</span>
                    <span>0</span>
                  </div>
                  <div className="chart-bars-wrapper">
                    {timelineData.map((dayData, idx) => {
                      const heightPct = (dayData.count / maxChartCount) * 100;
                      return (
                        <div key={idx} className="chart-bar-col">
                          <div className="chart-bar-wrapper">
                            <div 
                              className={`chart-bar-value ${dayData.count > 0 ? 'has-data' : ''}`}
                              style={{ height: `${heightPct}%` }}
                            >
                              <div className="chart-bar-tooltip">
                                <div className="tooltip-date">{dayData.label}</div>
                                <div className="tooltip-value">{dayData.count} {dayData.count === 1 ? 'usuario' : 'usuarios'}</div>
                                {dayData.count > 0 && (
                                  <div className="tooltip-details">
                                    {dayData.users.slice(0, 3).map((u, i) => (
                                      <div key={i} className="tooltip-detail-item">
                                        💍 {u.couple_name1.split(' ')[0]} & {u.couple_name2.split(' ')[0]}
                                      </div>
                                    ))}
                                    {dayData.users.length > 3 && (
                                      <div className="tooltip-detail-more">y {dayData.users.length - 3} más...</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="chart-bar-label">{dayData.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Desglose Diario Card */}
              <div className="breakdown-card card">
                <div className="breakdown-header">
                  <h3>Registro Histórico por Días</h3>
                  <span className="breakdown-subtitle">Haz clic en un día para ver las parejas registradas</span>
                </div>

                <div className="days-list">
                  {sortedDatesWithRegistrations.map((dateStr) => {
                    const dayUsers = groupedUsers[dateStr] || [];
                    const isExpanded = !!expandedDays[dateStr];
                    const pctOfPeak = (dayUsers.length / peakDayCount) * 100;
                    
                    // Formato legible de fecha
                    const dateObj = new Date(dateStr + 'T00:00:00');
                    const formattedDate = dateObj.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    return (
                      <div key={dateStr} className={`day-list-item-wrapper ${isExpanded ? 'expanded' : ''}`}>
                        <div 
                          className="day-list-item-header" 
                          onClick={() => toggleExpandDay(dateStr)}
                        >
                          <div className="day-info-col">
                            <span className="day-name">{formattedDate}</span>
                            <div className="day-pct-bar-container">
                              <div className="day-pct-bar" style={{ width: `${pctOfPeak}%` }}></div>
                            </div>
                          </div>

                          <div className="day-meta-col">
                            <span className="day-user-count">
                              {dayUsers.length} {dayUsers.length === 1 ? 'usuario' : 'usuarios'}
                            </span>
                            <button className="btn-expand-day">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="day-details-panel">
                            {dayUsers.map((user, uIdx) => {
                              const regTime = user.created_at 
                                ? new Date(user.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) 
                                : '--:--';
                              return (
                                <div key={uIdx} className="registered-couple-row">
                                  <div className="couple-names">
                                    <span className="couple-emoji">💍</span>
                                    <strong>{user.couple_name1}</strong> <span className="ampersand">&</span> <strong>{user.couple_name2}</strong>
                                  </div>
                                  <div className="couple-meta-info">
                                    {user.city && <span className="couple-city">📍 {user.city}</span>}
                                    <span className="couple-time">🕒 {regTime}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-feedback-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .admin-header h2 {
          font-family: var(--font-serif);
          font-size: 28px;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .admin-header .subtitle {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 13.5px;
          color: var(--muted);
        }

        .btn-refresh {
          height: 38px;
          font-size: 11px;
          padding: 0 16px;
        }

        /* Tabs de Navegación */
        .admin-tabs-nav {
          display: flex;
          border-bottom: 1px solid var(--line);
          margin-bottom: 28px;
          gap: 8px;
        }
        .admin-tab-btn {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 12px 18px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
          margin-bottom: -1px;
        }
        .admin-tab-btn:hover {
          color: var(--ink);
        }
        .admin-tab-btn.active {
          color: var(--gold-hover);
          border-bottom-color: var(--gold);
        }
        .tab-badge {
          background-color: var(--cream-dark);
          color: var(--ink);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
        .gold-badge {
          background-color: var(--gold);
          color: var(--white);
        }

        /* Grid de Filtros / Métricas */
        .feedback-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .metric-card-lite {
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 16px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
        }
        .metric-card-lite:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-small);
        }
        .metric-card-lite.active {
          background-color: var(--cream);
          border-color: var(--gold);
        }
        .metric-card-lite.clickable-disabled {
          cursor: default;
        }
        .metric-card-lite.clickable-disabled:hover {
          transform: none;
          box-shadow: none;
          border-color: var(--line);
        }
        .metric-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }
        .metric-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
        }
        .metric-value {
          font-size: 24px;
          font-family: var(--font-serif);
          font-weight: 500;
          color: var(--ink);
        }
        .text-unit {
          font-size: 12px;
          font-family: var(--font-sans);
          color: var(--muted);
          font-weight: 400;
        }
        
        .border-bug.active { background-color: #fff5f5; border-color: var(--red); }
        .text-bug { color: var(--red); }
        .border-improvement.active { background-color: #fffbf4; border-color: var(--gold); }
        .text-gold { color: var(--gold-hover); }
        .border-question.active { background-color: #f4fafb; border-color: #3b82f6; }
        .text-question { color: #3b82f6; }

        /* Alerta de Error */
        .error-alert {
          background-color: rgba(162, 95, 95, 0.06);
          border: 1px solid rgba(162, 95, 95, 0.2);
          color: var(--red);
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
        }
        .error-message {
          font-size: 13px;
          line-height: 1.5;
        }
        .sql-instructions {
          margin-top: 12px;
          background: var(--white);
          border: 1px solid rgba(162, 95, 95, 0.15);
          padding: 12px;
        }
        .sql-instructions p {
          font-weight: 600;
          margin-bottom: 6px;
        }
        .sql-instructions code {
          display: block;
          white-space: pre-wrap;
          font-family: monospace;
          background-color: var(--cream);
          padding: 8px;
          border-radius: 4px;
          font-size: 11px;
          user-select: all;
          color: #333;
        }

        /* Lista de Tarjetas (Feedback) */
        .feedback-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feedback-item-card {
          padding: 24px;
          border: 1px solid var(--line);
          background-color: var(--white);
          transition: var(--transition);
        }
        .feedback-item-card:hover {
          border-color: var(--cream-dark);
          box-shadow: var(--shadow-small);
        }

        .feedback-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .feedback-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .feedback-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .badge-bug { background-color: #ffebeb; color: var(--red); }
        .badge-improvement { background-color: #fff6e5; color: var(--gold); }
        .badge-question { background-color: #e6f0fa; color: #1e40af; }
        .badge-default { background-color: var(--cream); color: var(--muted); }

        .feedback-date {
          font-size: 12px;
          color: var(--muted);
        }

        .btn-resolve-feedback {
          background: none;
          border: 1px solid var(--line);
          padding: 6px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: var(--transition);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .btn-resolve-feedback:hover {
          border-color: var(--red);
          color: var(--red);
          background-color: #ffebeb;
        }

        .feedback-message {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 16px;
          white-space: pre-wrap;
        }

        .feedback-user-info {
          border-top: 1px solid var(--line);
          padding-top: 12px;
          font-size: 12px;
        }
        .user-email-label {
          color: var(--muted);
        }
        .user-email-value {
          font-weight: 500;
          color: var(--ink);
        }

        /* DISEÑO PANEL ESTADÍSTICAS USUARIOS */
        .users-dashboard-layout {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Tarjeta de Gráfico */
        .chart-card {
          padding: 24px;
          background-color: var(--white);
          border: 1px solid var(--line);
        }
        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .chart-card-header h3 {
          font-family: var(--font-serif);
          font-size: 18px;
          color: var(--ink);
          font-weight: 500;
        }
        .chart-controls {
          display: flex;
          gap: 4px;
          border: 1px solid var(--line);
          padding: 2px;
          background-color: var(--cream);
        }
        .chart-control-btn {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          padding: 6px 12px;
          cursor: pointer;
          transition: var(--transition);
        }
        .chart-control-btn:hover {
          color: var(--ink);
        }
        .chart-control-btn.active {
          background-color: var(--white);
          color: var(--gold-hover);
          box-shadow: var(--shadow-small);
        }

        /* Custom Chart */
        .custom-chart-container {
          display: flex;
          height: 240px;
          padding-top: 20px;
          padding-bottom: 10px;
          position: relative;
        }
        .chart-y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 35px;
          color: var(--muted);
          font-size: 10px;
          font-weight: 600;
          text-align: right;
          padding-right: 12px;
          border-right: 1px solid var(--line);
          height: calc(100% - 24px); /* Alinear con el área de barras */
        }
        .chart-bars-wrapper {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: flex-end;
          padding-left: 12px;
          height: 100%;
        }
        .chart-bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
          position: relative;
          min-width: 15px;
        }
        .chart-bar-wrapper {
          width: 50%;
          max-width: 28px;
          height: calc(100% - 24px);
          display: flex;
          align-items: flex-end;
          position: relative;
        }
        .chart-bar-value {
          width: 100%;
          background: var(--cream-dark);
          border-radius: 2px 2px 0 0;
          transition: height 0.5s ease-out, background-color 0.2s;
          position: relative;
          cursor: pointer;
        }
        .chart-bar-value.has-data {
          background: linear-gradient(180deg, var(--gold-hover) 0%, var(--gold) 100%);
        }
        .chart-bar-value:hover {
          filter: brightness(1.08);
        }
        .chart-bar-label {
          font-size: 9px;
          font-weight: 600;
          color: var(--muted);
          margin-top: 8px;
          text-align: center;
          white-space: nowrap;
          height: 16px;
        }

        /* Tooltip del Gráfico */
        .chart-bar-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--ink);
          color: var(--white);
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.15s ease-in-out;
          z-index: 10;
          box-shadow: var(--shadow-medium);
          margin-bottom: 8px;
        }
        .chart-bar-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: var(--ink) transparent transparent transparent;
        }
        .chart-bar-value:hover .chart-bar-tooltip {
          opacity: 1;
          visibility: visible;
          bottom: calc(100% + 4px);
        }
        .tooltip-date {
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 4px;
          margin-bottom: 6px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--cream);
        }
        .tooltip-value {
          font-weight: bold;
          font-family: var(--font-serif);
          font-size: 13px;
        }
        .tooltip-details {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 9px;
          text-align: left;
          color: rgba(255, 255, 255, 0.8);
        }
        .tooltip-detail-item {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Desglose Diario */
        .breakdown-card {
          padding: 24px;
          background-color: var(--white);
          border: 1px solid var(--line);
        }
        .breakdown-header {
          margin-bottom: 20px;
        }
        .breakdown-header h3 {
          font-family: var(--font-serif);
          font-size: 18px;
          color: var(--ink);
          font-weight: 500;
          margin-bottom: 4px;
        }
        .breakdown-subtitle {
          font-size: 12px;
          color: var(--muted);
          font-family: var(--font-serif);
          font-style: italic;
        }
        
        .days-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .days-list::-webkit-scrollbar {
          width: 4px;
        }
        .days-list::-webkit-scrollbar-thumb {
          background-color: var(--cream-dark);
          border-radius: 4px;
        }

        .day-list-item-wrapper {
          border: 1px solid var(--line);
          background-color: var(--white);
          transition: var(--transition);
        }
        .day-list-item-wrapper:hover {
          border-color: var(--cream-dark);
        }
        .day-list-item-wrapper.expanded {
          border-color: var(--gold-hover);
        }

        .day-list-item-header {
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .day-info-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          margin-right: 24px;
        }
        .day-name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ink);
          text-transform: capitalize;
        }
        .day-pct-bar-container {
          width: 100%;
          max-width: 240px;
          height: 4px;
          background-color: var(--cream);
          border-radius: 2px;
          overflow: hidden;
        }
        .day-pct-bar {
          height: 100%;
          background-color: var(--gold);
          border-radius: 2px;
        }

        .day-meta-col {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .day-user-count {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          font-family: var(--font-serif);
        }
        .btn-expand-day {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: var(--transition);
        }
        .day-list-item-wrapper:hover .btn-expand-day {
          color: var(--gold-hover);
        }

        /* Panel Expandido Detalles */
        .day-details-panel {
          border-top: 1px solid var(--line);
          background-color: #fbf9f6;
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .registered-couple-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: var(--white);
          border: 1px solid var(--line);
          border-radius: 2px;
          font-size: 13px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .couple-names {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--ink);
        }
        .couple-emoji {
          font-size: 14px;
        }
        .ampersand {
          color: var(--gold-hover);
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 600;
        }
        .couple-meta-info {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 11px;
          color: var(--muted);
        }
        .couple-city {
          font-weight: 500;
        }

        /* ESTADOS COMUNES */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }
        .loading-state p {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--muted);
        }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed var(--cream-dark);
          background: transparent;
        }
        .empty-state h3 {
          font-family: var(--font-serif);
          font-size: 20px;
          margin-top: 16px;
          margin-bottom: 6px;
          color: var(--ink);
        }
        .empty-state p {
          color: var(--muted);
          max-width: 400px;
          line-height: 1.5;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .feedback-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .custom-chart-container {
            height: 180px;
          }
          .registered-couple-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .couple-meta-info {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
