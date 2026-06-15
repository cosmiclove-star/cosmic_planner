import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MessageSquare, Trash2, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle, Loader2 } from 'lucide-react';

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | bug | improvement | question
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

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

  return (
    <div className="admin-feedback-container fade-in">
      <div className="admin-header">
        <div className="title-section">
          <h2>Panel de Feedback</h2>
          <p className="subtitle">Administración y revisión de sugerencias enviadas por las novias</p>
        </div>
        
        <button 
          className="btn btn-secondary btn-refresh" 
          onClick={fetchFeedback}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : 'Actualizar Lista'}
        </button>
      </div>

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
            <span className="metric-value text-improvement">{counts.improvement}</span>
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
              <code>{`CREATE POLICY "Admins can select feedback" ON public.feedback FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = 'test@example.com' OR auth.jwt() ->> 'email' LIKE '%@cosmiclove.es');
CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' = 'test@example.com' OR auth.jwt() ->> 'email' LIKE '%@cosmiclove.es');`}</code>
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

      <style>{`
        .admin-feedback-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px 8px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
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
          font-size: 10px;
          padding: 0 16px;
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
        .metric-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
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
        
        .border-bug.active { background-color: #fff5f5; border-color: var(--red); }
        .text-bug { color: var(--red); }
        .border-improvement.active { background-color: #fffbf4; border-color: var(--gold); }
        .text-improvement { color: var(--gold); }
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

        /* Lista de Tarjetas */
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
        }
      `}</style>
    </div>
  );
}
