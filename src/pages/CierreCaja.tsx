import { useState } from 'react';
import { MOCK_CIERRES, MOCK_VENTAS } from '../data/mock';
import type { CierreCaja, SesionUsuario } from '../types/models';

interface CierreCajaPageProps { sesion: SesionUsuario }

export function CierreCajaPage({ sesion }: CierreCajaPageProps) {
  const [cierres, setCierres]           = useState<CierreCaja[]>(MOCK_CIERRES);
  const [montoReal, setMontoReal]       = useState('');
  const [montoInicial, setMontoInicial] = useState('');
  const [modalApertura, setModalApertura] = useState(false);

  const cierreActivo = cierres.find(c => !c.fecha_cierre && c.id_usuario === sesion.usuario.id_usuario)
                    ?? cierres.find(c => !c.fecha_cierre);

  // Calcular ventas de hoy para el cierre activo
  const ventasDelCierre = MOCK_VENTAS.filter(v =>
    cierreActivo && v.fecha_venta >= cierreActivo.fecha_apertura
  );
  const montoCalculado = (cierreActivo?.monto_inicial ?? 0) +
    ventasDelCierre.reduce((s, v) => s + v.total, 0);

  function abrirCaja() {
    if (!montoInicial || isNaN(+montoInicial) || +montoInicial < 0) return;
    const nuevo: CierreCaja = {
      id_cierre: Math.max(...cierres.map(c => c.id_cierre)) + 1,
      id_usuario: sesion.usuario.id_usuario,
      fecha_apertura: new Date().toISOString(),
      fecha_cierre: null,
      monto_inicial: +montoInicial,
      monto_calculado: null, monto_real: null, diferencia: null,
    };
    setCierres(prev => [...prev, nuevo]);
    setMontoInicial('');
    setModalApertura(false);
  }

  function cerrarCaja() {
    if (!cierreActivo || !montoReal || isNaN(+montoReal)) return;
    const diferencia = +montoReal - montoCalculado;
    setCierres(prev => prev.map(c =>
      c.id_cierre === cierreActivo.id_cierre
        ? { ...c, fecha_cierre: new Date().toISOString(), monto_calculado: montoCalculado, monto_real: +montoReal, diferencia }
        : c
    ));
    setMontoReal('');
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Cierre de Caja<i className="bi bi-safe2" /></h1>
          <p className="page-sub">Control de apertura y cierre de caja diaria</p>
        </div>
        {!cierreActivo && (
          <button className="btn btn-primary" onClick={() => setModalApertura(true)}>
            + Abrir Caja
          </button>
        )}
      </div>

      {/* Estado actual de caja */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lilac-soft)', marginBottom: 16 }}>
          Estado Actual
        </h2>
        {cierreActivo ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div className="stat-card" style={{ background: 'rgba(34,100,60,0.2)', borderColor: 'rgba(52,211,153,0.3)' }}>
              <div className="stat-label">Estado</div>
              <div className="stat-value" style={{ fontSize: '1.1rem', color: '#6ee7a0' }}><i className="bi bi-unlock-fill" /> ABIERTA</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Apertura</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ice)', marginTop: 4 }}>{fmtDate(cierreActivo.fecha_apertura)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Monto Inicial</div>
              <div className="stat-value">Bs {cierreActivo.monto_inicial.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Ventas del Turno</div>
              <div className="stat-value" style={{ color: 'var(--lilac-soft)' }}>
                Bs {ventasDelCierre.reduce((s, v) => s + v.total, 0).toFixed(2)}
              </div>
              <div className="stat-trend">{ventasDelCierre.length} ventas</div>
            </div>
            <div className="stat-card glass-card-lilac">
              <div className="stat-label">Monto Calculado</div>
              <div className="stat-value" style={{ color: 'var(--lilac-soft)' }}>Bs {montoCalculado.toFixed(2)}</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
            <div className="empty-icon"><i className="bi bi-lock" /></div>
            <p>No hay caja abierta. Abre la caja para comenzar a registrar ventas.</p>
          </div>
        )}

        {/* Formulario de cierre */}
        {cierreActivo && (
          <div style={{
            borderTop: '1px solid var(--line)', paddingTop: 20,
            display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap',
          }}>
            <div className="field" style={{ flex: 1, minWidth: 200 }}>
              <label>Monto Real en Caja (Bs)</label>
              <input
                className="input" type="number" min="0" step="0.01"
                value={montoReal} onChange={e => setMontoReal(e.target.value)}
                placeholder={`Calculado: ${montoCalculado.toFixed(2)}`}
              />
            </div>
            {montoReal && (
              <div style={{ fontSize: '0.85rem', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: Math.abs(+montoReal - montoCalculado) < 0.01
                  ? 'rgba(34,100,60,0.2)' : 'rgba(139,26,26,0.2)',
                border: `1px solid ${Math.abs(+montoReal - montoCalculado) < 0.01 ? 'rgba(52,211,153,0.3)' : 'rgba(139,26,26,0.3)'}`,
              }}>
                Diferencia: <strong style={{ color: +montoReal - montoCalculado >= 0 ? '#6ee7a0' : '#f87171' }}>
                  Bs {(+montoReal - montoCalculado).toFixed(2)}
                </strong>
              </div>
            )}
            <button
              className="btn btn-danger"
              disabled={!montoReal}
              onClick={cerrarCaja}
            >
              Cerrar Caja
            </button>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="glass-card">
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--f-display)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lilac-soft)' }}>
          Historial de Cierres
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Inicial</th>
                <th>Calculado</th>
                <th>Real</th>
                <th>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {cierres.slice().reverse().map(c => {
                const diff = c.diferencia;
                return (
                  <tr key={c.id_cierre}>
                    <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>#{c.id_cierre}</td>
                    <td style={{ fontSize: '0.82rem' }}>{fmtDate(c.fecha_apertura)}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {c.fecha_cierre ? fmtDate(c.fecha_cierre) : (
                        <span className="badge badge-green">ABIERTA</span>
                      )}
                    </td>
                    <td>Bs {c.monto_inicial.toFixed(2)}</td>
                    <td>{c.monto_calculado != null ? `Bs ${c.monto_calculado.toFixed(2)}` : '—'}</td>
                    <td>{c.monto_real != null ? `Bs ${c.monto_real.toFixed(2)}` : '—'}</td>
                    <td>
                      {diff != null ? (
                        <span style={{ color: diff >= 0 ? '#6ee7a0' : '#f87171', fontWeight: 700 }}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(2)}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal apertura */}
      {modalApertura && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalApertura(false)}>
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <span className="modal-title">Abrir Caja</span>
              <button className="modal-close" onClick={() => setModalApertura(false)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label>Monto Inicial (Bs) *</label>
                <input
                  className="input" type="number" min="0" step="0.01"
                  value={montoInicial} onChange={e => setMontoInicial(e.target.value)}
                  placeholder="Ej: 500.00" autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setModalApertura(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={abrirCaja}>Abrir Caja</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
