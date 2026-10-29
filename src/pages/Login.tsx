import { useState, useEffect } from 'react';
import type { SesionUsuario } from '../types/models';
import { MOCK_USUARIOS } from '../data/mock';

interface LoginProps {
  onLogin: (sesion: SesionUsuario) => void;
}

// Credenciales de demo
const DEMO_CREDS = [
  { username: 'admin',   password: 'admin123',   rol: 'admin'   },
  { username: 'cajero1', password: 'cajero123',  rol: 'cajero'  },
];

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de API
    setTimeout(() => {
      const usuario = MOCK_USUARIOS.find(
        u => u.username === username && u.estado,
      );
      // Validación mock: user existe + password no vacío
      if (usuario && password.length >= 6) {
        onLogin({
          usuario,
          cierreActivo: usuario.rol === 'CAJERO' ? {
            id_cierre: 2, id_usuario: usuario.id_usuario,
            fecha_apertura: new Date().toISOString(),
            fecha_cierre: null,
            monto_inicial: 500.00,
            monto_calculado: null, monto_real: null, diferencia: null,
          } : null,
        });
      } else {
        setError('Usuario o contraseña incorrectos.');
        setLoading(false);
      }
    }, 700);
  }

  return (
    <div className="login-wrap">
      <form
        className="login-card"
        onSubmit={handleSubmit}
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon"><i className="bi bi-book-half" /></div>
          <strong>Librería El Rey</strong>
          <span>Sistema de Punto de Venta</span>
        </div>

        {/* Campos */}
        <div className="flex-col gap-3">
          <div className="field">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              className="input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ej: admin"
              autoComplete="username"
              autoFocus
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            fontSize: '0.82rem', color: '#f87171',
            background: 'rgba(139,26,26,0.2)', border: '1px solid rgba(139,26,26,0.4)',
            padding: '8px 12px', borderRadius: 'var(--radius-md)', margin: 0,
          }}>
            <i className="bi bi-exclamation-triangle-fill" /> {error}
          </p>
        )}

        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
          {loading ? 'Verificando…' : 'Ingresar al Sistema'}
        </button>

        {/* Hint de demo */}
        <div style={{
          fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center',
          borderTop: '1px solid var(--line)', paddingTop: 12,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <span style={{ color: 'var(--lilac-soft)', fontWeight: 600 }}><i className="bi bi-person-badge" /> Cuentas de demostración</span>
          {DEMO_CREDS.map(c => (
            <button
              key={c.username}
              type="button"
              onClick={() => { setUsername(c.username); setPassword(c.password); setError(''); }}
              style={{
                cursor: 'pointer', background: 'rgba(124,58,237,0.15)',
                border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
                padding: '5px 10px', color: 'var(--ice)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.15)')}
            >
              <span style={{ color: 'var(--lilac-soft)' }}>{c.username}</span>
              {' · '}
              <span style={{ opacity: 0.6 }}>{c.rol}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
