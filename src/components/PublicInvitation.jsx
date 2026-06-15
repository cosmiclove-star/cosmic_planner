import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Smartphone, Check, Sparkles, MapPin, Calendar, Clock, Gift, AlertTriangle, Heart, Loader2 } from 'lucide-react';

const formatName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\b\w/g, c => c.toUpperCase());
};

export default function PublicInvitation({ weddingId }) {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // RSVP Form States
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestSide, setGuestSide] = useState('Común');
  const [guestDiet, setGuestDiet] = useState('');
  const [isChild, setIsChild] = useState(false);

  // Template config parsed from URL query parameter
  const [activeTemplate, setActiveTemplate] = useState('classic');

  const templates = {
    classic: {
      name: 'Clásico & Elegante',
      bg: '#fcfdfd',
      primaryColor: '#1a1a1a',
      fontHeader: 'var(--font-serif)',
      fontNames: 'var(--font-serif)',
      namesFontSize: '26px',
      namesLetterSpacing: '0.15em',
      namesTransform: 'uppercase',
      borderStyle: 'double #1a1a1a 3px',
      pattern: '∞',
      btnBg: '#1a1a1a',
      btnColor: '#fcfdfd'
    }
  };

  useEffect(() => {
    // Parse style from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const styleParam = urlParams.get('estilo');
    if (styleParam && templates[styleParam]) {
      setActiveTemplate(styleParam);
    }

    const fetchWedding = async () => {
      try {
        const { data, error } = await supabase
          .from('weddings')
          .select('*')
          .eq('id', weddingId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError('No se ha encontrado la invitación.');
        } else {
          setWedding(data);
        }
      } catch (err) {
        console.error('Error fetching wedding details:', err);
        setError('Error al cargar la invitación. Por favor, comprueba el enlace.');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [weddingId]);

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setRsvpLoading(true);
    setRsvpError(null);

    const guestId = 'g_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);

    try {
      const { error } = await supabase
        .from('guests')
        .insert([{
          id: guestId,
          wedding_id: weddingId,
          name: guestName.trim(),
          side: guestSide,
          diet: guestDiet.trim(),
          status: 'confirmed',
          table_id: null,
          is_child: isChild
        }]);

      if (error) throw error;
      setRsvpSubmitted(true);
      setTimeout(() => {
        setShowRsvpModal(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setRsvpError('Hubo un error al confirmar tu asistencia. Inténtalo de nuevo.');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="public-loading">
        <Loader2 className="animate-spin text-gold" size={40} />
        <p>Cargando invitación...</p>
        <style>{`
          .public-loading {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--cream);
            color: var(--ink);
            font-family: var(--font-serif);
            font-style: italic;
            gap: 16px;
          }
          .text-gold {
            color: var(--gold);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error || !wedding) {
    return (
      <div className="public-error">
        <Heart className="error-icon" size={48} />
        <h2>Invitación no encontrada</h2>
        <p>{error || 'El enlace que has seguido parece no ser válido.'}</p>
        <style>{`
          .public-error {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--cream);
            color: var(--ink);
            padding: 24px;
            text-align: center;
            gap: 16px;
          }
          .error-icon {
            color: var(--red);
            opacity: 0.7;
          }
          .public-error h2 {
            font-size: 24px;
            font-family: var(--font-serif);
          }
          .public-error p {
            max-width: 400px;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  const currentTemplate = templates[activeTemplate] || templates.boho;

  const invitationData = {
    title: '¡Nos casamos!',
    body: 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más queremos los hace inolvidables. Por eso, nos encantaría que nos acompañaseis en el día más feliz de nuestra historia.',
    locationName: wedding.city || 'Finca El Invernadero',
    locationAddress: 'Ctra. de la Sierra, Km 12 - Madrid',
    time: '18:30 h',
    dressCode: 'Formal y elegante',
    giftInfo: 'ES91 1234 5678 9012 3456 7890 (Vuestro mejor regalo es compartirlo con nosotros)',
    transport: 'Habrá servicio de autobús de ida y vuelta desde Plaza de España'
  };

  return (
    <div className="public-invitation-container">
      <div className="public-invitation-card" style={{ backgroundColor: currentTemplate.bg, color: currentTemplate.primaryColor, borderColor: currentTemplate.primaryColor }}>
        
        {/* Decoración superior */}
        <div className="mock-pattern">{currentTemplate.pattern}</div>

        {/* Encabezado */}
        <span className="mock-names-pre">Estáis invitados a la boda de</span>
        <h1 className="mock-names" style={{ 
          fontFamily: currentTemplate.fontNames,
          fontSize: currentTemplate.namesFontSize,
          letterSpacing: currentTemplate.namesLetterSpacing,
          textTransform: currentTemplate.namesTransform,
          color: currentTemplate.primaryColor
        }}>
          {formatName(wedding.couple_name1).toUpperCase()} <br /><span style={{ fontFamily: 'inherit', textTransform: 'lowercase' }}>y</span><br /> {formatName(wedding.couple_name2).toUpperCase()}
        </h1>
        
        <div className="mock-divider" style={{ backgroundColor: currentTemplate.primaryColor }}></div>

        {/* Título y Cuerpo */}
        <h2 className="mock-title" style={{ fontFamily: currentTemplate.fontHeader }}>
          {invitationData.title}
        </h2>
        <p className="mock-body" style={{ color: currentTemplate.primaryColor + 'd0' }}>
          {invitationData.body}
        </p>

        <div className="mock-divider-dots">•••</div>

        {/* Fecha y Lugar */}
        <div className="mock-detail-block">
          <span className="mock-detail-label">Cuándo</span>
          <span className="mock-detail-value font-bold">
            {new Date(wedding.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="mock-detail-value">{invitationData.time}</span>
        </div>

        <div className="mock-detail-block">
          <span className="mock-detail-label">Dónde</span>
          <span className="mock-detail-value font-bold">{invitationData.locationName}</span>
          <span className="mock-detail-value small-text">{invitationData.locationAddress}</span>
        </div>

        {/* Otros Detalles */}
        <div className="mock-details-box" style={{ border: currentTemplate.borderStyle }}>
          <div className="mock-box-item">
            <h5>Código de Vestimenta</h5>
            <p>{invitationData.dressCode}</p>
          </div>
          <div className="mock-box-item">
            <h5>Transporte</h5>
            <p>{invitationData.transport}</p>
          </div>
          <div className="mock-box-item">
            <h5>Regalos</h5>
            <p className="gift-text-small">{invitationData.giftInfo}</p>
          </div>
        </div>

        {/* Botón de Confirmación */}
        <button 
          type="button"
          className="rsvp-confirm-btn" 
          style={{ backgroundColor: currentTemplate.btnBg, color: currentTemplate.btnColor }}
          onClick={() => setShowRsvpModal(true)}
        >
          Confirmar Asistencia
        </button>

        <div className="mock-footer">
          Con cariño, Cosmic Love Portal
        </div>
      </div>

      {/* Modal de RSVP */}
      {showRsvpModal && (
        <div className="rsvp-modal-overlay">
          <div className="rsvp-modal-card card">
            <button 
              type="button" 
              className="close-modal-btn"
              onClick={() => {
                if (!rsvpLoading) setShowRsvpModal(false);
              }}
            >
              &times;
            </button>

            {!rsvpSubmitted ? (
              <>
                <h3 className="modal-title">Confirmar Asistencia</h3>
                <p className="modal-subtitle">Por favor, indícanos tus datos para organizar el banquete de la boda.</p>

                {rsvpError && (
                  <div className="rsvp-error-box">
                    <AlertTriangle size={14} />
                    <span>{rsvpError}</span>
                  </div>
                )}

                <form onSubmit={handleRsvpSubmit} className="rsvp-form">
                  <div className="form-group">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej. Sofía Valenzuela"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      disabled={rsvpLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lado de la familia</label>
                    <select
                      className="form-control"
                      value={guestSide}
                      onChange={(e) => setGuestSide(e.target.value)}
                      disabled={rsvpLoading}
                    >
                      <option value="Novio">Lado de {formatName(wedding.couple_name1)}</option>
                      <option value="Novia">Lado de {formatName(wedding.couple_name2)}</option>
                      <option value="Común">Común</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alergias o Restricciones Dietéticas</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej. Ninguna, Celíaco, Alergia a frutos secos..."
                      value={guestDiet}
                      onChange={(e) => setGuestDiet(e.target.value)}
                      disabled={rsvpLoading}
                    />
                  </div>

                  <div className="form-group inline-checkbox-group">
                    <input
                      type="checkbox"
                      id="isChildCheckbox"
                      checked={isChild}
                      onChange={(e) => setIsChild(e.target.checked)}
                      disabled={rsvpLoading}
                    />
                    <label htmlFor="isChildCheckbox" className="checkbox-label">
                      Menú Infantil (Menores de 12 años)
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full"
                    disabled={rsvpLoading || !guestName.trim()}
                  >
                    {rsvpLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={14} /> Enviando confirmación...
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Confirmar Asistencia
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="rsvp-success-state fade-in">
                <div className="success-heart-container">
                  <Heart size={48} className="heart-animated" fill="var(--gold)" />
                </div>
                <h3>¡Muchas gracias!</h3>
                <p>Tu asistencia ha sido confirmada correctamente.</p>
                <p className="success-sub">Hemos guardado tu confirmación para los novios.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .public-invitation-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--cream);
          padding: 40px 20px;
          box-sizing: border-box;
          font-family: var(--font-sans);
        }
        
        .public-invitation-card {
          width: 100%;
          max-width: 420px;
          padding: 48px 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          position: relative;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          border-width: 1px;
        }

        .mock-pattern {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .mock-names-pre {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          opacity: 0.8;
          margin-bottom: 12px;
        }

        .mock-names {
          font-family: var(--font-script);
          font-size: 42px;
          line-height: 1.1;
          font-weight: 400;
          letter-spacing: 0.01em;
          margin-bottom: 20px;
        }

        .mock-divider {
          width: 50px;
          height: 1px;
          margin-bottom: 24px;
          opacity: 0.6;
        }

        .mock-title {
          font-size: 20px;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .mock-body {
          font-size: 13px;
          line-height: 1.7;
          margin-bottom: 24px;
          padding: 0 8px;
        }

        .mock-divider-dots {
          font-size: 16px;
          letter-spacing: 0.25em;
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .mock-detail-block {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mock-detail-label {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          opacity: 0.6;
          margin-bottom: 6px;
        }

        .mock-detail-value {
          font-size: 13.5px;
        }

        .font-bold {
          font-weight: 600;
        }

        .small-text {
          font-size: 11px;
          opacity: 0.8;
          margin-top: 3px;
        }

        .mock-details-box {
          width: 100%;
          padding: 20px 16px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
          box-sizing: border-box;
        }

        .mock-box-item h5 {
          font-family: var(--font-sans);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          opacity: 0.7;
        }

        .mock-box-item p {
          font-size: 11.5px;
          line-height: 1.4;
          color: inherit;
          opacity: 0.9;
        }

        .gift-text-small {
          word-break: break-all;
        }

        .rsvp-confirm-btn {
          width: 100%;
          padding: 16px;
          border: none;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: var(--transition);
          margin-bottom: 20px;
        }
        
        .rsvp-confirm-btn:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
        }

        .mock-footer {
          font-size: 9px;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 12px;
        }

        /* Modal Styles */
        .rsvp-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(26, 26, 26, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .rsvp-modal-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 40px 32px;
          position: relative;
          box-sizing: border-box;
          animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .close-modal-btn {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: var(--accent);
          transition: var(--transition);
        }
        
        .close-modal-btn:hover {
          color: var(--ink);
        }

        .modal-title {
          font-family: var(--font-serif);
          font-size: 24px;
          margin-bottom: 6px;
          color: var(--ink);
        }

        .modal-subtitle {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .rsvp-error-box {
          background-color: rgba(162, 95, 95, 0.08);
          border: 1px solid rgba(162, 95, 95, 0.2);
          color: var(--red);
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
        }

        .rsvp-form {
          display: flex;
          flex-direction: column;
        }

        .inline-checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0 24px 0;
        }

        .inline-checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--ink);
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 12.5px;
          color: var(--ink);
          cursor: pointer;
          user-select: none;
        }

        .rsvp-success-state {
          text-align: center;
          padding: 20px 0;
        }

        .success-heart-container {
          margin-bottom: 16px;
        }

        .heart-animated {
          animation: beat 1s infinite alternate;
          filter: drop-shadow(0 2px 8px rgba(197, 168, 128, 0.3));
        }

        .rsvp-success-state h3 {
          font-family: var(--font-serif);
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--ink);
        }

        .rsvp-success-state p {
          font-size: 14px;
          color: var(--muted);
        }

        .success-sub {
          font-size: 12px !important;
          margin-top: 8px;
          font-style: italic;
        }

        @keyframes beat {
          to { transform: scale(1.15); }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
