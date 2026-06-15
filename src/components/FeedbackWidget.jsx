import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { MessageSquare, X, Check, Heart, Loader2, AlertTriangle } from 'lucide-react';

export default function FeedbackWidget({ weddingId, userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('improvement'); // bug | improvement | question
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('feedback')
        .insert([{
          wedding_id: weddingId || null,
          user_email: email.trim() || null,
          type: type,
          message: message.trim()
        }]);

      if (submitError) throw submitError;

      setSubmitted(true);
      setMessage('');
      
      // Auto cerrar tras 3 segundos
      setTimeout(() => {
        setIsOpen(false);
        // Esperar a que termine la animación de cierre para resetear el estado de éxito
        setTimeout(() => {
          setSubmitted(false);
          setType('improvement');
        }, 300);
      }, 3000);

    } catch (err) {
      console.error('Error al enviar sugerencia:', err);
      setError('Lo sentimos, no pudimos enviar tu mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
    setSubmitted(false);
    setError(null);
  };

  return (
    <>
      {/* Botón Flotante Principal */}
      <button 
        type="button" 
        className="feedback-trigger-btn"
        onClick={() => setIsOpen(true)}
        title="Enviar sugerencia o reportar fallo"
      >
        <MessageSquare size={16} />
        <span>Sugerencias / Fallos</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="feedback-modal-overlay" onClick={handleClose}>
          <div 
            className="feedback-modal-card card" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className="feedback-close-btn"
              onClick={handleClose}
              disabled={loading}
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <h3 className="feedback-title">¿Cómo podemos mejorar?</h3>
                <p className="feedback-subtitle">Tu feedback nos ayuda a perfeccionar el portal. Cuéntanos cualquier error o sugerencia que encuentres.</p>

                {error && (
                  <div className="feedback-error-box">
                    <AlertTriangle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="feedback-form">
                  <div className="form-group">
                    <label className="form-label">Tipo de Comentario</label>
                    <select 
                      className="form-control"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      disabled={loading}
                    >
                      <option value="improvement">Sugerencia / Idea de Mejora</option>
                      <option value="bug">Error / Fallo visual o técnico</option>
                      <option value="question">Duda / Pregunta</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tu Mensaje</label>
                    <textarea 
                      className="form-control feedback-textarea"
                      placeholder="Escribe detalladamente tu comentario aquí..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tu Email (Opcional)</label>
                    <input 
                      type="email"
                      className="form-control"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full"
                    disabled={loading || !message.trim()}
                    style={{ marginTop: '10px' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="feedback-spinner" size={14} /> Enviando...
                      </>
                    ) : (
                      <>
                        Enviar comentario
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="feedback-success-state">
                <div className="feedback-heart-container">
                  <Heart size={44} className="feedback-heart-beat" fill="var(--gold)" />
                </div>
                <h3>¡Muchas gracias!</h3>
                <p>Tu comentario ha sido recibido y enviado directamente al equipo de Cosmic Love.</p>
                <p className="feedback-success-sub">Agradecemos enormemente que nos ayudes a mejorar.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estilos del Widget de Feedback */}
      <style>{`
        /* Botón Flotante */
        .feedback-trigger-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink);
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 15px rgba(26, 26, 26, 0.05);
          border-radius: 0px;
        }
        .feedback-trigger-btn:hover {
          background-color: var(--cream);
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 26, 26, 0.1);
        }
        @media (max-width: 600px) {
          .feedback-trigger-btn {
            bottom: 16px;
            right: 16px;
            padding: 10px 14px;
            font-size: 10px;
          }
        }

        /* Overlay del Modal */
        .feedback-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(26, 26, 26, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: feedbackFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Tarjeta del Modal */
        .feedback-modal-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--white);
          padding: 36px 28px;
          position: relative;
          box-sizing: border-box;
          border-radius: 0px;
          animation: feedbackScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .feedback-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .feedback-close-btn:hover {
          color: var(--ink);
        }

        .feedback-title {
          font-family: var(--font-serif);
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 6px;
          color: var(--ink);
        }

        .feedback-subtitle {
          font-family: var(--font-serif) !important;
          font-style: italic !important;
          font-size: 12.5px !important;
          line-height: 1.4 !important;
          color: var(--muted) !important;
          margin-bottom: 24px;
        }

        .feedback-textarea {
          resize: none;
          line-height: 1.5;
        }

        .feedback-error-box {
          background-color: rgba(162, 95, 95, 0.08);
          border: 1px solid rgba(162, 95, 95, 0.2);
          color: var(--red);
          padding: 10px 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        /* Pantalla de Éxito */
        .feedback-success-state {
          text-align: center;
          padding: 20px 10px;
        }
        .feedback-heart-container {
          margin-bottom: 14px;
          display: flex;
          justify-content: center;
        }
        .feedback-heart-beat {
          animation: feedbackBeat 0.8s infinite alternate;
          filter: drop-shadow(0 2px 8px rgba(197, 168, 128, 0.3));
        }
        .feedback-success-state h3 {
          font-family: var(--font-serif);
          font-size: 22px;
          margin-bottom: 8px;
          color: var(--ink);
        }
        .feedback-success-state p {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.5;
        }
        .feedback-success-sub {
          font-size: 11.5px !important;
          margin-top: 10px;
          font-style: italic;
          color: var(--accent) !important;
        }

        /* Spinner Animación */
        .feedback-spinner {
          animation: feedbackSpin 1s linear infinite;
          margin-right: 6px;
        }

        /* Keyframes */
        @keyframes feedbackFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes feedbackScaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes feedbackBeat {
          to { transform: scale(1.15); }
        }
        @keyframes feedbackSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
