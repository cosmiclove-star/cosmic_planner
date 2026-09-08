import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Save, Check } from 'lucide-react';

export default function Settings({ isOpen, onClose }) {
  const [geminiKey, setGeminiKey] = useState('');
  const [showGemini, setShowGemini] = useState(false);
  
  const [wpUrl, setWpUrl] = useState('');
  const [wpUser, setWpUser] = useState('');
  const [wpPassword, setWpPassword] = useState('');
  const [showWpPassword, setShowWpPassword] = useState(false);
  
  const [brevoKey, setBrevoKey] = useState('');
  const [showBrevo, setShowBrevo] = useState(false);
  
  const [toneGuidelines, setToneGuidelines] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem('nl_gemini_key') || '');
      setWpUrl(localStorage.getItem('nl_wp_url') || '');
      setWpUser(localStorage.getItem('nl_wp_user') || '');
      setWpPassword(localStorage.getItem('nl_wp_password') || '');
      setBrevoKey(localStorage.getItem('nl_brevo_key') || '');
      setToneGuidelines(localStorage.getItem('nl_tone_guidelines') || '');
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('nl_gemini_key', geminiKey.trim());
    localStorage.setItem('nl_wp_url', wpUrl.trim().replace(/\/$/, '')); // Remove trailing slash
    localStorage.setItem('nl_wp_user', wpUser.trim());
    localStorage.setItem('nl_wp_password', wpPassword.trim());
    localStorage.setItem('nl_brevo_key', brevoKey.trim());
    localStorage.setItem('nl_tone_guidelines', toneGuidelines.trim());
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Configuraciones de API</h3>
          <button className="btn-text" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '20px' }}>
              Configura tus credenciales. Se guardan localmente en tu navegador de forma segura y nunca se envían a ningún otro servidor que no sean las APIs oficiales.
            </p>

            {/* Gemini API Key */}
            <div className="form-group">
              <label className="form-label">Gemini API Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showGemini ? 'text' : 'password'}
                  className="input-field"
                  style={{ width: '100%', paddingRight: '44px' }}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-text"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}
                  onClick={() => setShowGemini(!showGemini)}
                >
                  {showGemini ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="text-muted" style={{ fontSize: '11px', marginTop: '4px' }}>
                Requerida para la sugerencia de temas y redacción. Consíguela gratis en Google AI Studio.
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

            {/* WordPress Config */}
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Integración con WordPress (Opcional)
            </h4>
            
            <div className="form-group">
              <label className="form-label">URL del sitio WordPress</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://tuweb.com"
                value={wpUrl}
                onChange={(e) => setWpUrl(e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Usuario WordPress</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="admin"
                  value={wpUser}
                  onChange={(e) => setWpUser(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña de Aplicación</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showWpPassword ? 'text' : 'password'}
                    className="input-field"
                    style={{ width: '100%', paddingRight: '44px' }}
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={wpPassword}
                    onChange={(e) => setWpPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-text"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}
                    onClick={() => setShowWpPassword(!showWpPassword)}
                  >
                    {showWpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <span className="text-muted" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
              Genera una "Contraseña de aplicación" en tu perfil de WordPress (Usuarios &gt; Tu perfil). No uses tu contraseña habitual.
            </span>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

            {/* Brevo Config */}
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Integración con Brevo (Opcional)
            </h4>

            <div className="form-group">
              <label className="form-label">Brevo API Key (v3)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showBrevo ? 'text' : 'password'}
                  className="input-field"
                  style={{ width: '100%', paddingRight: '44px' }}
                  placeholder="xkeysib-..."
                  value={brevoKey}
                  onChange={(e) => setBrevoKey(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-text"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}
                  onClick={() => setShowBrevo(!showBrevo)}
                >
                  {showBrevo ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="text-muted" style={{ fontSize: '11px', marginTop: '4px' }}>
                Requerida para crear campañas o plantillas automáticas desde la app.
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

            {/* Custom Tone Config */}
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Directrices de Tono y Estilo (Opcional)
            </h4>

            <div className="form-group">
              <label className="form-label">Instrucciones Estilísticas (de ChatGPT)</label>
              <textarea
                className="input-field"
                style={{ width: '100%', minHeight: '120px', resize: 'vertical', fontSize: '13px', lineHeight: '1.5', padding: '10px 12px' }}
                placeholder="Ej: Escribe siempre en primera persona del plural (nosotros). Evita exclamaciones innecesarias. Prefiere frases cortas y con ritmo rápido. Utiliza un tono sofisticado de bodas de lujo..."
                value={toneGuidelines}
                onChange={(e) => setToneGuidelines(e.target.value)}
              />
              <span className="text-muted" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
                Estas directrices se añadirán al prompt del sistema para orientar la redacción del post y de la newsletter.
              </span>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {saved ? (
                <>
                  <Check size={16} /> ¡Guardado!
                </>
              ) : (
                <>
                  <Save size={16} /> Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
