import React, { useState } from 'react';
import { Calendar, User, Users, MapPin, DollarSign, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    coupleName1: '',
    coupleName2: '',
    date: '',
    location: '',
    guests: 120,
    style: 'classic',
    budget: 35000,
    priorities: []
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePriorityToggle = (priority) => {
    const current = [...formData.priorities];
    if (current.includes(priority)) {
      setFormData({ ...formData, priorities: current.filter(p => p !== priority) });
    } else {
      setFormData({ ...formData, priorities: [...current, priority] });
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.coupleName1.trim() !== '' && formData.coupleName2.trim() !== '' && formData.date !== '';
    if (step === 2) return formData.location.trim() !== '';
    if (step === 3) return formData.budget > 0;
    if (step === 4) return formData.style !== '';
    return true;
  };

  return (
    <div className="onboarding-container fade-in">
      <div className="onboarding-card">
        {/* Progreso */}
        <div className="progress-bar-container">
          <div className="progress-bar-line" style={{ width: `${(step / 4) * 100}%` }}></div>
          <span className="progress-text">Paso {step} de 4</span>
        </div>

        <div className="onboarding-brand">
          <img src="/logo.png" alt="Cosmic Love" className="brand-logo-img" style={{ maxHeight: '90px', width: 'auto', marginBottom: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          <p className="brand-subtext">Empezamos a dar forma a vuestra boda</p>
        </div>

        {/* Paso 1: Datos Básicos */}
        {step === 1 && (
          <div className="step-content fade-in">
            <h3 className="step-title">Lo primero: vosotros</h3>
            <p className="step-desc">Vuestros nombres y la fecha de la boda para empezar a crear una experiencia más vuestra.</p>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Tu nombre</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={16} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe tu nombre"
                    value={formData.coupleName1}
                    onChange={(e) => setFormData({ ...formData, coupleName1: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre de tu pareja</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={16} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de tu pareja"
                    value={formData.coupleName2}
                    onChange={(e) => setFormData({ ...formData, coupleName2: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de la boda</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={16} />
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Localización e Invitados */}
        {step === 2 && (
          <div className="step-content fade-in">
            <h3 className="step-title">¿Dónde y con quién?</h3>
            <p className="step-desc">Ayúdanos a perfilar la logística de vuestra boda.</p>

            <div className="form-group">
              <label className="form-label">Localización / Ciudad</label>
              <div className="input-with-icon">
                <MapPin className="input-icon" size={16} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Madrid, Mallorca, Girona..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Número de invitados aproximado: <span className="serif-number">{formData.guests}</span></label>
              <div className="slider-container">
                <Users className="slider-icon-left" size={16} />
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  className="form-slider"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                />
                <span className="slider-value">{formData.guests} pax</span>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Presupuesto y Prioridades */}
        {step === 3 && (
          <div className="step-content fade-in">
            <h3 className="step-title" style={{ marginBottom: '4px' }}>Presupuesto y Prioridades</h3>
            <p className="step-desc" style={{ marginBottom: '18px' }}>Cuéntanos cuánto queréis invertir y qué aspectos os importan más.</p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Presupuesto Total Estimado: <span className="serif-number">{formData.budget.toLocaleString('es-ES')} €</span></label>
              <div className="slider-container">
                <DollarSign className="slider-icon-left" size={16} />
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  className="form-slider"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                />
                <span className="slider-value">{formData.budget.toLocaleString('es-ES')} €</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">¿En qué queréis poner el foco? (Elige las que quieras)</label>
              <div className="priorities-grid">
                {['Catering y Banquete', 'Fotografía y Video', 'Vestuario y Belleza', 'Decoración y Flores', 'Música y Entretenimiento', 'Wedding Planner', 'Otras'].map((p) => {
                  const isSelected = formData.priorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`priority-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handlePriorityToggle(p)}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Paso 4: Selección de Estilo */}
        {step === 4 && (
          <div className="step-content fade-in">
            <h3 className="step-title">¿Cuál es vuestro estilo?</h3>
            <p className="step-desc">Seleccionad la estética que mejor defina la boda de vuestros sueños.</p>

            <div className="style-grid">
              {[
                { id: 'classic', title: 'Clásico & Elegante', desc: 'Sinfonía de blanco, etiqueta tradicional, elegancia atemporal y detalles refinados.', img: '/style-classic.jpg' },
                { id: 'boho', title: 'Boho & Rustic', desc: 'Celebraciones al aire libre, alfombras kilim, plumas, flores silvestres y libertad.', img: '/style-boho.jpg' },
                { id: 'modern', title: 'Moderno & Minimalista', desc: 'Líneas limpias, espacios industriales, paleta monocromática y diseño contemporáneo.', img: '/style-modern.jpg' },
                { id: 'romantic', title: 'Romántico & Fine Art', desc: 'Tonos pastel, luz suave, arreglos florales orgánicos y atmósfera de ensueño.', img: '/style-romantic.jpg' },
                { id: 'rustic', title: 'Campestre & Rústico Chic', desc: 'Madera vista, luces de verbena, naturaleza y un ambiente cálido e informal.', img: '/style-rustic.jpg' },
                { id: 'mediterranean', title: 'Mediterráneo', desc: 'Olivos, buganvillas, luz del atardecer, terracota y sabor a mar.', img: '/style-mediterranean.jpg' },
                { id: 'cosmic', title: 'Extra Cosmic: Nocturna', desc: 'Celebración bajo las estrellas, velas infinitas, misterio y magia astral.', img: '/style-cosmic.jpg' },
                { id: 'custom', title: 'A vuestra manera', desc: 'Una celebración diseñada sin reglas ni moldes, pensada al 100% para reflejar vuestra auténtica personalidad.', img: '' }
              ].map((styleOpt) => {
                const isActive = formData.style === styleOpt.id;
                return (
                  <div
                    key={styleOpt.id}
                    className={`style-card ${isActive ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, style: styleOpt.id })}
                  >
                    {styleOpt.img ? (
                      <div
                        className="style-card-image"
                        style={{ backgroundImage: `url(${styleOpt.img})` }}
                      >
                        <div className="style-card-overlay"></div>
                      </div>
                    ) : (
                      <div className="style-card-no-image">
                        <Heart className="style-card-heart-icon" size={32} />
                      </div>
                    )}
                    <div className="style-card-body">
                      <h4>{styleOpt.title}</h4>
                      <p>{styleOpt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="onboarding-actions">
          {step > 1 && (
            <button className="btn btn-secondary btn-back" onClick={handleBack}>
              <ArrowLeft size={14} /> Atrás
            </button>
          )}
          <button
            className="btn btn-primary btn-next"
            onClick={handleNext}
            disabled={!isStepValid()}
            style={{ marginLeft: step === 1 ? 'auto' : '0' }}
          >
            {step === 4 ? 'Crear mi cuenta' : 'Continuar'} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .onboarding-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background-color: var(--cream);
        }
        .onboarding-card {
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 48px;
          width: 100%;
          max-width: 780px;
          position: relative;
          box-shadow: var(--shadow-medium);
        }
        .progress-bar-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--cream-dark);
        }
        .progress-bar-line {
          height: 100%;
          background-color: var(--ink);
          transition: width 0.4s ease;
        }
        .progress-text {
          position: absolute;
          top: 12px;
          right: 20px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-transform: uppercase;
          font-family: var(--font-serif);
        }
        .serif-number {
          font-family: var(--font-serif);
          font-weight: 500;
          color: var(--ink);
          margin-left: 4px;
        }
        .onboarding-brand {
          text-align: center;
          margin-bottom: 40px;
        }
        .brand-icon {
          color: var(--gold);
          margin-bottom: 12px;
        }
        .brand-logo-text {
          font-family: var(--font-serif);
          font-size: 32px;
          letter-spacing: -0.5px;
          color: var(--ink);
        }
        .brand-subtext {
          font-size: 12px;
          letter-spacing: 0.05em;
          color: var(--muted);
          text-transform: uppercase;
          margin-top: 4px;
        }
        .step-content {
          margin-bottom: 40px;
        }
        .step-title {
          font-size: 28px;
          margin-bottom: 8px;
          text-align: center;
          line-height: 1.2;
        }
        .step-desc {
          text-align: center;
          margin-bottom: 32px;
          font-size: 14px;
          line-height: 1.4;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .step-title {
            font-size: 21px;
            line-height: 1.2;
            margin-bottom: 6px;
          }
          .step-desc {
            font-size: 12.5px;
            margin-bottom: 24px;
            line-height: 1.4;
          }
        }
        .input-with-icon {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--accent);
        }
        .input-with-icon .form-control {
          padding-left: 42px;
        }
        .slider-container {
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: var(--cream);
          padding: 16px;
          border: 1px solid var(--line);
        }
        .slider-icon-left {
          color: var(--accent);
        }
        .form-slider {
          flex: 1;
          -webkit-appearance: none;
          height: 2px;
          background: var(--line);
          outline: none;
        }
        .form-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--ink);
          cursor: pointer;
          transition: var(--transition);
        }
        .form-slider::-webkit-slider-thumb:hover {
          background: var(--gold);
          transform: scale(1.1);
        }
        .slider-value {
          font-size: 12px;
          font-weight: 600;
          color: var(--ink);
          min-width: 80px;
          text-align: right;
        }
        .style-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .full-width-card {
          grid-column: span 2;
        }
        @media (max-width: 600px) {
          .style-grid {
            grid-template-columns: 1fr;
          }
          .full-width-card {
            grid-column: span 1;
          }
        }
        .style-card {
          border: 1px solid var(--line);
          cursor: pointer;
          transition: var(--transition);
          background-color: var(--white);
          overflow: hidden;
        }
        .style-card-image {
          height: 140px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .style-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(26, 26, 26, 0.4));
        }
        .style-card-no-image {
          height: 140px;
          background-color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--line);
        }
        .style-card-heart-icon {
          color: var(--accent);
          opacity: 0.4;
        }
        .style-card-body {
          padding: 16px;
        }
        .style-card-body h4 {
          font-size: 18px;
          margin-bottom: 6px;
          font-family: var(--font-serif);
        }
        .style-card-body p {
          font-size: 12px;
          line-height: 1.4;
        }
        .style-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-subtle);
        }
        .style-card.active {
          border-color: var(--ink);
          outline: 2px solid var(--ink);
        }
        .priorities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }
        .priority-chip {
          background-color: var(--white);
          border: 1px solid var(--line);
          padding: 12px 16px;
          font-family: var(--font-sans);
          font-size: 12px;
          color: var(--muted);
          cursor: pointer;
          text-align: left;
          transition: var(--transition);
        }
        .priority-chip:hover {
          border-color: var(--accent);
          color: var(--ink);
        }
        .priority-chip.active {
          background-color: var(--cream-dark);
          border-color: var(--ink);
          color: var(--ink);
          font-weight: 500;
        }
        .onboarding-actions {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--line);
          padding-top: 24px;
        }
        .btn-next {
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}
