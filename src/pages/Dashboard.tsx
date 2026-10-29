import { useEffect, useRef } from 'react';
import { MOCK_VENTAS, MOCK_PRODUCTOS, MOCK_DETALLES_VENTA, MOCK_CIERRES } from '../data/mock';
import type { SesionUsuario } from '../types/models';

interface DashboardProps { sesion: SesionUsuario }

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('.rv');
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-in'), 80 + i * 100);
    });
  }, [ref]);
}

export function Dashboard({ sesion }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref as React.RefObject<HTMLElement>);

  // --- Cálculos sobre datos mock ---
  const hoy = new Date().toISOString().slice(0, 10);
  const ventasHoy    = MOCK_VENTAS.filter(v => v.fecha_venta.startsWith(hoy));
  const totalHoy     = ventasHoy.reduce((s, v) => s + v.total, 0);
  const totalMes     = MOCK_VENTAS.reduce((s, v) => s + v.total, 0);
  const stockBajo    = MOCK_PRODUCTOS.filter(p => p.estado && p.stock_actual < p.stock_minimo);
  const sinStock     = MOCK_PRODUCTOS.filter(p => p.estado && p.stock_actual === 0);
  const cierreActivo = MOCK_CIERRES.find(c => !c.fecha_cierre);

  // Top 5 productos más vendidos
  const conteo: Record<number, number> = {};
  MOCK_DETALLES_VENTA.forEach(d => { conteo[d.id_producto] = (conteo[d.id_producto] || 0) + d.cantidad; });
  const top5 = Object.entries(conteo)
    .sort(([, a], [, b]) => b - a).slice(0, 5)
    .map(([id, qty]) => ({
      prod: MOCK_PRODUCTOS.find(p => p.id_producto === +id)!,
      qty,
    }));

  // Ventas por método de pago (hoy + ayer = toda la mock data)
  const porMetodo: Record<string, number> = {};
  MOCK_VENTAS.forEach(v => { porMetodo[v.metodo_pago] = (porMetodo[v.metodo_pago] || 0) + v.total; });

  const fmt = (n: number) => `Bs ${n.toFixed(2)}`;

  return (
    <div ref={ref}>
      {/* Saludo */}
      <div className="page-header rv" style={{ '--d': '0s' } as React.CSSProperties}>
        <div className="page-header-left">
          <h1 className="page-title">
            Bienvenido, {sesion.usuario.nombre_completo.split(' ')[0]} <i className="bi bi-stars" />
          </h1>
          <p className="page-sub">Resumen general del sistema – datos de demostración</p>
        </div>
        <span className="badge badge-lilac">ADMINISTRADOR</span>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card rv" style={{ '--d': '0.1s' } as React.CSSProperties}>
          <div className="stat-icon"><i className="bi bi-cash-coin" /></div>
          <div className="stat-label">Ventas Hoy</div>
          <div className="stat-value">{ventasHoy.length > 0 ? fmt(totalHoy) : 'Bs 0.00'}</div>
          <div className="stat-trend up"><i className="bi bi-arrow-up-right" /> {ventasHoy.length} transacciones</div>
        </div>
        <div className="stat-card rv" style={{ '--d': '0.18s' } as React.CSSProperties}>
          <div className="stat-icon"><i className="bi bi-graph-up-arrow" /></div>
          <div className="stat-label">Total del Período</div>
          <div className="stat-value">{fmt(totalMes)}</div>
          <div className="stat-trend">{MOCK_VENTAS.length} ventas registradas</div>
        </div>
        <div className="stat-card rv" style={{ '--d': '0.26s' } as React.CSSProperties}>
          <div className="stat-icon"><i className="bi bi-exclamation-triangle" /></div>
          <div className="stat-label">Stock Bajo Mínimo</div>
          <div className="stat-value" style={{ color: stockBajo.length > 0 ? '#f87171' : 'var(--ice)' }}>
            {stockBajo.length}
          </div>
          <div className={`stat-trend ${stockBajo.length > 0 ? 'down' : ''}`}>
            {sinStock.length > 0 ? `${sinStock.length} sin stock` : 'Todo en orden'}
          </div>
        </div>
        <div className="stat-card rv" style={{ '--d': '0.34s' } as React.CSSProperties}>
          <div className="stat-icon"><i className="bi bi-safe2" /></div>
          <div className="stat-label">Estado de Caja</div>
          <div className="stat-value" style={{ fontSize: '1.1rem', color: cierreActivo ? 'var(--lilac-soft)' : '#f87171' }}>
            {cierreActivo ? 'ABIERTA' : 'CERRADA'}
          </div>
          <div className="stat-trend warn">
            {cierreActivo ? `Inicial: Bs ${cierreActivo.monto_inicial.toFixed(2)}` : 'Sin apertura'}
          </div>
        </div>
      </div>

      {/* Fila de tablas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top productos */}
        <div className="glass-card rv" style={{ padding: 20, '--d': '0.42s' } as React.CSSProperties}>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lilac-soft)', marginBottom: 14 }}>
            <i className="bi bi-trophy" /> Productos más vendidos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {top5.map(({ prod, qty }, i) => (
              <div key={prod.id_producto} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: '0.7rem', color: 'var(--muted)', width: 20 }}>
                  #{i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prod.nombre}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{prod.categoria}</div>
                </div>
                <span className="badge badge-purple">{qty} uds</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ventas por método */}
        <div className="glass-card rv" style={{ padding: 20, '--d': '0.5s' } as React.CSSProperties}>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lilac-soft)', marginBottom: 14 }}>
            <i className="bi bi-credit-card-2-front" /> Ventas por Método de Pago
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(porMetodo).map(([metodo, monto]) => {
              const maxMonto = Math.max(...Object.values(porMetodo));
              const pct = (monto / maxMonto) * 100;
              const icono = metodo === 'EFECTIVO' ? 'bi-cash-stack' : metodo === 'QR' ? 'bi-qr-code' : 'bi-credit-card';
              return (
                <div key={metodo} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span><i className={`bi ${icono}`} /> {metodo}</span>
                    <span style={{ color: 'var(--lilac-soft)' }}>{fmt(monto)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(139,92,246,0.2)' }}>
                    <div style={{
                      height: '100%', borderRadius: 99, width: `${pct}%`,
                      background: 'linear-gradient(90deg, var(--purple-deep), var(--purple-light))',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alertas de stock */}
      {stockBajo.length > 0 && (
        <div className="glass-card rv" style={{ padding: 20, marginTop: 20, borderColor: 'rgba(196,181,253,0.35)', '--d': '0.58s' } as React.CSSProperties}>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', marginBottom: 14 }}>
            <i className="bi bi-exclamation-octagon" /> Alertas de Stock
          </h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map(p => (
                  <tr key={p.id_producto}>
                    <td>{p.nombre}</td>
                    <td><span className="text-muted text-sm">{p.categoria}</span></td>
                    <td>
                      <span style={{ color: p.stock_actual === 0 ? '#f87171' : '#fbbf24', fontWeight: 700 }}>
                        {p.stock_actual}
                      </span>
                    </td>
                    <td><span className="text-muted">{p.stock_minimo}</span></td>
                    <td>
                      <span className={`badge ${p.stock_actual === 0 ? 'badge-red' : 'badge-muted'}`}>
                        {p.stock_actual === 0 ? 'SIN STOCK' : 'BAJO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
