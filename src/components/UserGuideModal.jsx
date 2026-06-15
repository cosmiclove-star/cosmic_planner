import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, DollarSign, Users, CreditCard, Calendar, ArrowLeft, ArrowRight, X, Heart } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose, setActiveTab }) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Guardar que vio la guía y redireccionar
      localStorage.setItem('cl_seen_guide', 'true');
      onClose();
      setActiveTab('calendar');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('cl_seen_guide', 'true');
    onClose();
  };

  // Diapositivas de la guía
  const slides = [
    {
      icon: <Sparkles size={40} className="guide-icon" style={{ color: 'var(--gold)' }} />,
      title: "¡Bienvenid@ a tu Cosmic Planner!",
      desc: "¡Enhorabuena! Ya has completado el onboarding y tienes tu cuenta configurada. Hemos creado esta pequeña guía rápida para mostrarte cómo aprovechar al máximo esta herramienta."
    },
    {
      icon: <DollarSign size={40} className="guide-icon" style={{ color: 'var(--accent)' }} />,
      title: "1. Presupuesto Inteligente",
      desc: "Lleva el control exacto de tus previsiones y pagos reales. Podrás registrar cada proveedor, marcar qué partidas están pagadas, buscar por concepto y descargar todos tus gastos directamente en un Excel (CSV) compatible."
    },
    {
      icon: <Users size={40} className="guide-icon" style={{ color: 'var(--accent)' }} />,
      title: "2. Invitados y Mesas",
      desc: "Gestiona tu lista de invitados indicando dietas especiales y acompañantes. Después, usa el planificador interactivo (Seating Plan) para distribuir a tus familiares y amigos en sus respectivas mesas de forma sencilla."
    },
    {
      icon: <CreditCard size={40} className="guide-icon" style={{ color: 'var(--accent)' }} />,
      title: "3. Invitación Digital Premium",
      desc: "Diseña tu invitación interactiva: personaliza el texto, elige música de fondo y copio el enlace para enviarlo por WhatsApp. Tus invitados podrán confirmar asistencia y dietas al instante."
    },
    {
      icon: <Calendar size={40} className="guide-icon" style={{ color: 'var(--gold)' }} />,
      title: "¡Vamos a tu Primera Tarea!",
      desc: "Pulsa el botón inferior para ir a la agenda y empieza creando tu primera cita según los plazos recomendados."
    }
  ];

  const currentSlide = slides[step - 1];

  return createPortal(
    <div className="guide-modal-overlay">
      <div className="card guide-modal-content">
        <button type="button" className="btn-close-guide" onClick={handleSkip} title="Cerrar guía">
          <X size={18} />
        </button>

        <div className="guide-step-indicators">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`indicator-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        <div className="guide-slide-body">
          <div className="guide-icon-wrapper">
            {currentSlide.icon}
          </div>
          <h3>{currentSlide.title}</h3>
          <p className="guide-slide-desc">{currentSlide.desc}</p>
        </div>

        <div className="guide-actions">
          {step > 1 ? (
            <button className="btn btn-secondary btn-guide-prev" onClick={handleBack}>
              <ArrowLeft size={14} /> Anterior
            </button>
          ) : (
            <button className="btn btn-text btn-guide-skip" onClick={handleSkip} style={{ color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Omitir guía
            </button>
          )}

          <button className="btn btn-primary btn-guide-next" onClick={handleNext}>
            {step === 5 ? (
              <>
                ¡Ir a la Agenda! <Heart size={14} style={{ fill: 'currentColor' }} />
              </>
            ) : (
              <>
                Siguiente <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .guide-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(26, 26, 26, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .guide-modal-content {
          max-width: 480px;
          width: 90%;
          padding: 40px;
          text-align: center;
          position: relative;
          background-color: var(--white);
          border: 1px solid var(--line);
          box-shadow: var(--shadow-medium);
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .btn-close-guide {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          transition: var(--transition);
          padding: 4px;
        }
        .btn-close-guide:hover {
          color: var(--ink);
        }

        .guide-step-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--cream-dark);
          transition: var(--transition);
        }
        .indicator-dot.active {
          background-color: var(--gold);
          transform: scale(1.3);
        }

        .guide-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }

        .guide-slide-body h3 {
          font-size: 22px;
          font-family: var(--font-serif);
          margin-bottom: 12px;
          color: var(--ink);
        }

        .guide-slide-desc {
          font-family: var(--font-serif) !important;
          font-style: italic !important;
          font-size: 15.5px !important;
          line-height: 1.5 !important;
          color: var(--muted) !important;
          margin-bottom: 32px;
          min-height: 76px; /* previene saltos de altura bruscos */
        }

        .guide-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--line);
          padding-top: 24px;
        }
        .guide-actions .btn {
          font-size: 10px;
          padding: 10px 20px;
          height: 38px;
        }

        @media (max-width: 600px) {
          .guide-modal-content {
            padding: 30px 20px;
          }
          .guide-slide-body h3 {
            font-size: 19px;
          }
          .guide-slide-desc {
            font-size: 14.5px !important;
            margin-bottom: 24px;
            min-height: 84px;
          }
          .guide-icon-wrapper {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
          }
          .guide-icon-wrapper svg {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
