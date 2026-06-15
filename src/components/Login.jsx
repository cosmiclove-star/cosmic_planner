import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Heart, Mail, Lock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const translateError = (msg) => {
    if (!msg) return 'Ocurrió un error inesperado';
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('email not confirmed')) {
      return 'El correo electrónico no ha sido confirmado todavía. Por favor, revisa tu bandeja de entrada para verificarlo.';
    }
    if (lowerMsg.includes('invalid login credentials')) {
      return 'El correo o la contraseña son incorrectos. Por favor, inténtalo de nuevo.';
    }
    if (lowerMsg.includes('user already registered')) {
      return 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
    }
    if (lowerMsg.includes('password should be at least 6 characters')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (lowerMsg.includes('signup requires a valid email')) {
      return 'Por favor, introduce un correo electrónico válido.';
    }
    
    return msg;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setMessage(null);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(translateError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || `Error al iniciar sesión con ${provider}`);
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card card">
        <div className="login-header">
          <img src="/logo.png" alt="Cosmic Love" className="login-logo-img" style={{ maxHeight: '80px', width: 'auto', marginBottom: '16px' }} />
          <p className="login-subtitle">Empieza a dar forma a la boda que imaginas</p>
        </div>

        {error && (
          <div className="auth-alert error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-alert success-alert">
            <Sparkles size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon-left" />
              <input
                id="email"
                type="email"
                className="form-control padded-input"
                placeholder="ejemplo@cosmiclove.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon-left" />
              <input
                id="password"
                type="password"
                className="form-control padded-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isRegister ? (
              'Crear Cuenta'
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="divider-text">
          <span>O ACCEDE CON</span>
        </div>

        <div className="oauth-buttons">
          <button 
            type="button" 
            className="btn btn-secondary oauth-btn" 
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <button 
            type="button" 
            className="btn btn-secondary oauth-btn" 
            onClick={() => handleOAuthLogin('apple')}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.13.08.4.15.54.15.91.03 2.02-.57 2.81-1.38z" fill="#000000"/>
            </svg>
            Apple
          </button>
        </div>

        <div className="login-footer">
          <button 
            type="button" 
            className="btn-text toggle-auth-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setMessage(null);
            }}
          >
            {isRegister 
              ? '¿Ya tienes cuenta? Iniciar Sesión' 
              : '¿No tienes cuenta? Crear una cuenta'}
          </button>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          background-color: var(--cream);
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          text-align: center;
          background-color: var(--white);
          border: 1px solid var(--line);
        }

        .login-header {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .login-icon {
          color: var(--gold);
          margin-bottom: 16px;
        }

        .login-title {
          font-family: var(--font-serif);
          font-size: 32px;
          font-weight: 300;
          letter-spacing: -0.5px;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1rem;
          color: var(--muted);
          line-height: 1.4;
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          font-size: 13px;
          font-family: var(--font-sans);
          margin-bottom: 24px;
          text-align: left;
        }

        .error-alert {
          background-color: #fdf2f2;
          color: var(--red);
          border: 1px solid #f8b4b4;
        }

        .success-alert {
          background-color: #f0fdf4;
          color: var(--green);
          border: 1px solid #bbf7d0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon-left {
          position: absolute;
          left: 16px;
          color: var(--accent);
          pointer-events: none;
        }

        .padded-input {
          padding-left: 48px !important;
        }

        .w-full {
          width: 100%;
        }

        .divider-text {
          position: relative;
          margin: 32px 0 20px;
          text-align: center;
        }

        .divider-text::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--line);
          z-index: 1;
        }

        .divider-text span {
          position: relative;
          background-color: var(--white);
          padding: 0 16px;
          font-family: var(--font-sans);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--accent);
          z-index: 2;
        }

        .oauth-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .oauth-btn {
          font-size: 10px !important;
          padding: 12px 18px !important;
          gap: 8px !important;
          border-radius: 0;
          background-color: var(--white);
          border: 1px solid var(--line);
        }

        .oauth-btn:hover {
          background-color: var(--cream-dark);
          color: var(--ink);
        }

        .login-footer {
          margin-top: 16px;
          border-top: 1px solid var(--line);
          padding-top: 24px;
        }

        .toggle-auth-btn {
          cursor: pointer;
          font-weight: 500;
          font-size: 11px;
          color: var(--muted);
          transition: var(--transition);
        }

        .toggle-auth-btn:hover {
          color: var(--ink);
        }
      `}</style>
    </div>
  );
}
