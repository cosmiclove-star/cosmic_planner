import React, { useState } from 'react';
import { Copy, Eye, Smartphone, Check, Sparkles } from 'lucide-react';

const formatName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\b\w/g, c => c.toUpperCase());
};

export default function InvitationDesigner({ data }) {
  const [copied, setCopied] = useState(false);
  const [invitationData, setInvitationData] = useState({
    title: '¡Nos casamos!',
    body: 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más queremos los hace inolvidables. Por eso, nos encantaría que nos acompañaseis en el día más feliz de nuestra historia.',
    locationName: data.location || 'Finca El Invernadero',
    locationAddress: 'Ctra. de la Sierra, Km 12 - Madrid',
    time: '18:30 h',
    dressCode: 'Formal y elegante',
    giftInfo: 'ES91 1234 5678 9012 3456 7890 (Vuestro mejor regalo es compartirlo con nosotros)',
    transport: 'Habrá servicio de autobús de ida y vuelta desde Plaza de España'
  });

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

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?invitacion=${data.id}&estilo=${activeTemplate}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTemplate = templates[activeTemplate] || templates.classic;

  return (
    <div className="invitation-view fade-in">
      <div className="invitation-header-box">
        <h2>Diseño de la Invitación Digital</h2>
        <p>Configurad vuestra invitación interactiva. Los novios de Cosmic Love comparten una experiencia digital refinada y respetuosa con el medio ambiente.</p>
      </div>

      <div className="invitation-layout">
        {/* Lado Izquierdo: Formularios de Edición */}
        <div className="card edit-invitation-card">
          <h3>Personalizar Contenido</h3>

          <div className="form-group">
            <label className="form-label">Título de Bienvenida</label>
            <input
              type="text"
              className="form-control"
              value={invitationData.title}
              onChange={(e) => setInvitationData({ ...invitationData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Texto de la Invitación</label>
            <textarea
              className="form-control text-area-large"
              rows={4}
              value={invitationData.body}
              onChange={(e) => setInvitationData({ ...invitationData, body: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Espacio del Evento</label>
              <input
                type="text"
                className="form-control"
                value={invitationData.locationName}
                onChange={(e) => setInvitationData({ ...invitationData, locationName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hora del Enlace</label>
              <input
                type="text"
                className="form-control"
                value={invitationData.time}
                onChange={(e) => setInvitationData({ ...invitationData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección Completa</label>
            <input
              type="text"
              className="form-control"
              value={invitationData.locationAddress}
              onChange={(e) => setInvitationData({ ...invitationData, locationAddress: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Código de Vestimenta (Dress Code)</label>
            <input
              type="text"
              className="form-control"
              value={invitationData.dressCode}
              onChange={(e) => setInvitationData({ ...invitationData, dressCode: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Servicio de Autobús</label>
            <input
              type="text"
              className="form-control"
              value={invitationData.transport}
              onChange={(e) => setInvitationData({ ...invitationData, transport: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cuenta de Regalos / Info Pago</label>
            <input
              type="text"
              className="form-control"
              value={invitationData.giftInfo}
              onChange={(e) => setInvitationData({ ...invitationData, giftInfo: e.target.value })}
            />
          </div>

          <button type="button" className="btn btn-primary btn-full" onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check size={14} /> ¡Enlace Copiado!
              </>
            ) : (
              <>
                <Copy size={14} /> Copiar Enlace para WhatsApp / Email
              </>
            )}
          </button>
        </div>

        {/* Lado Derecho: Simulación Móvil Premium */}
        <div className="mobile-preview-section">
          <div className="phone-wrapper">
            <div className="phone-earpiece"></div>
            <div className="phone-screen" style={{ backgroundColor: currentTemplate.bg }}>
              {/* Contenido de la invitación simulada */}
              <div className="invitation-mockup-inner" style={{ color: currentTemplate.primaryColor, borderColor: currentTemplate.primaryColor }}>
                
                {/* Patrón decorativo superior */}
                <div className="mock-pattern">{currentTemplate.pattern}</div>

                {/* Encabezado */}
                <span className="mock-names-pre">Estáis invitados a la boda de</span>
                <h3 className="mock-names" style={{ 
                  fontFamily: currentTemplate.fontNames,
                  fontSize: currentTemplate.namesFontSize,
                  letterSpacing: currentTemplate.namesLetterSpacing,
                  textTransform: currentTemplate.namesTransform,
                  color: currentTemplate.primaryColor
                }}>
                  {formatName(data.coupleName1).toUpperCase()} <br /><span style={{ fontFamily: 'inherit', textTransform: 'lowercase' }}>y</span><br /> {formatName(data.coupleName2).toUpperCase()}
                </h3>
                
                <div className="mock-divider" style={{ backgroundColor: currentTemplate.primaryColor }}></div>

                {/* Título y Cuerpo */}
                <h4 className="mock-title" style={{ fontFamily: currentTemplate.fontHeader }}>
                  {invitationData.title}
                </h4>
                <p className="mock-body" style={{ color: currentTemplate.primaryColor + 'cc' }}>
                  {invitationData.body}
                </p>

                <div className="mock-divider-dots">•••</div>

                {/* Fecha y Lugar */}
                <div className="mock-detail-block">
                  <span className="mock-detail-label">Cuándo</span>
                  <span className="mock-detail-value font-bold">
                    {new Date(data.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
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

                {/* Botón Confirmar Asistencia Simulada */}
                <div className="mock-action-btn" style={{ backgroundColor: currentTemplate.btnBg, color: currentTemplate.btnColor }}>
                  Confirmar Asistencia
                </div>

                <div className="mock-footer">
                  Con cariño, Cosmic Love Portal
                </div>
              </div>
            </div>
            <div className="phone-home-indicator"></div>
          </div>
          <span className="preview-label-text">
            <Smartphone size={12} className="inline-icon" /> Vista previa interactiva en móvil
          </span>
        </div>
      </div>

      <style>{`
        .invitation-view {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .invitation-header-box {
          margin-bottom: 32px;
        }
        .invitation-header-box h2 {
          font-size: 32px;
          margin-bottom: 6px;
        }

        /* Layout */
        .invitation-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .invitation-layout {
            grid-template-columns: 1fr;
          }
        }
        .edit-invitation-card h3 {
          font-size: 20px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .text-area-large {
          resize: none;
          line-height: 1.5;
        }

        /* Template Selector */
        .template-selector-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 6px;
        }
        .template-btn {
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 10px 4px;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: var(--transition);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .template-btn:hover {
          border-color: var(--accent);
          color: var(--ink);
        }
        .template-btn.active {
          background-color: var(--ink);
          border-color: var(--ink);
          color: var(--white);
        }

        /* Simulación del Teléfono */
        .mobile-preview-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .phone-wrapper {
          width: 320px;
          height: 640px;
          background-color: #1a1a1a;
          border-radius: 40px;
          padding: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          position: relative;
          display: flex;
          flex-direction: column;
          border: 4px solid #2d2d2d;
        }
        .phone-earpiece {
          width: 60px;
          height: 4px;
          background-color: #2d2d2d;
          border-radius: 2px;
          margin: 4px auto 10px auto;
        }
        .phone-home-indicator {
          width: 100px;
          height: 4px;
          background-color: #2d2d2d;
          border-radius: 2px;
          margin: 8px auto 0 auto;
        }
        .phone-screen {
          flex: 1;
          border-radius: 28px;
          overflow-y: auto;
          padding: 24px 16px;
          position: relative;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        }
        .preview-label-text {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Contenido simulado de la invitación */
        .invitation-mockup-inner {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--font-sans);
          min-height: 100%;
        }
        .mock-pattern {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .mock-names-pre {
          font-size: 9px;
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
          margin-bottom: 16px;
        }
        .mock-divider {
          width: 40px;
          height: 1px;
          margin-bottom: 20px;
          opacity: 0.6;
        }
        .mock-title {
          font-size: 18px;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .mock-body {
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 20px;
          padding: 0 6px;
        }
        .mock-divider-dots {
          font-size: 14px;
          letter-spacing: 0.2em;
          margin-bottom: 20px;
          opacity: 0.5;
        }
        .mock-detail-block {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mock-detail-label {
          font-size: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
          margin-bottom: 4px;
        }
        .mock-detail-value {
          font-size: 12px;
        }
        .font-bold {
          font-weight: 600;
        }
        .small-text {
          font-size: 10px;
          opacity: 0.8;
          margin-top: 2px;
        }
        .mock-details-box {
          width: 100%;
          padding: 16px 12px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }
        .mock-box-item h5 {
          font-family: var(--font-sans);
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
          opacity: 0.7;
        }
        .mock-box-item p {
          font-size: 10px;
          line-height: 1.3;
          color: inherit;
          opacity: 0.9;
        }
        .gift-text-small {
          word-break: break-all;
        }
        .mock-action-btn {
          width: 100%;
          padding: 12px;
          color: var(--white);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          margin-top: auto;
          margin-bottom: 14px;
        }
        .mock-footer {
          font-size: 8px;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}
