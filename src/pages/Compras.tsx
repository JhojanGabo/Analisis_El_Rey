import { useState } from 'react';
import { MOCK_COMPRAS, MOCK_DETALLES_COMPRA, MOCK_PROVEEDORES, MOCK_PRODUCTOS, MOCK_USUARIOS } from '../data/mock';

export function Compras() {
  const [expandida, setExpandida] = useState<number | null>(null);

  function getProveedor(id: number) { return MOCK_PROVEEDORES.find(p => p.id_proveedor === id); }
  function getUsuario(id: number)   { return MOCK_USUARIOS.find(u => u.id_usuario === id); }
  function getDetalles(id: number)  { return MOCK_DETALLES_COMPRA.filter(d => d.id_compra === id); }
  function getProducto(id: number)  { return MOCK_PRODUCTOS.find(p => p.id_producto === id); }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const total = MOCK_COMPRAS.reduce((s, c) => s + c.total_compra, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Registro de Compras<i className="bi bi-box-seam" /></h1>
          <p className="page-sub">{MOCK_COMPRAS.length} compras · Total: Bs {total.toFixed(2)}</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Funcionalidad disponible al conectar el backend.')}>
          + Nueva Compra
        </button>
      </div>

      {/* Resumen de compras por proveedor */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {MOCK_PROVEEDORES.filter(pv => MOCK_COMPRAS.some(c => c.id_proveedor === pv.id_proveedor)).map(pv => {
          const comprasProv = MOCK_COMPRAS.filter(c => c.id_proveedor === pv.id_proveedor);
          const totalProv   = comprasProv.reduce((s, c) => s + c.total_compra, 0);
          return (
            <div key={pv.id_proveedor} className="stat-card">
              <div className="stat-icon"><i className="bi bi-building" /></div>
              <div className="stat-label">{pv.nombre_empresa}</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>Bs {totalProv.toFixed(0)}</div>
              <div className="stat-trend">{comprasProv.length} compras</div>
            </div>
          );
        })}
      </div>

      {/* Tabla compras */}
      <div className="glass-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Registrado por</th>
                <th>Total</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPRAS.slice().reverse().map(compra => {
                const prov    = getProveedor(compra.id_proveedor);
                const usuario = getUsuario(compra.id_usuario);
                const dets    = getDetalles(compra.id_compra);
                const isOpen  = expandida === compra.id_compra;

                return (
                  <>
                    <tr key={compra.id_compra}>
                      <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>#{compra.id_compra}</td>
                      <td style={{ fontSize: '0.82rem' }}>{fmtDate(compra.fecha_compra)}</td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{prov?.nombre_empresa}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>NIT: {prov?.nit_proveedor}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{usuario?.nombre_completo}</td>
                      <td style={{ color: 'var(--lilac-soft)', fontFamily: 'var(--f-display)', fontSize: '0.9rem' }}>
                        Bs {compra.total_compra.toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setExpandida(isOpen ? null : compra.id_compra)}
                        >
                          <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} /> {dets.length} prods
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${compra.id_compra}-det`}>
                        <td colSpan={6} style={{ padding: '0 0 8px 32px' }}>
                          <div style={{
                            background: 'rgba(124,58,237,0.08)',
                            border: '1px solid var(--line)',
                            borderRadius: 'var(--radius-md)',
                            padding: '12px 16px',
                            margin: '4px 0 8px',
                          }}>
                            <table style={{ width: '100%' }}>
                              <thead>
                                <tr>
                                  <th style={{ textAlign: 'left', fontSize: '0.68rem', color: 'var(--muted)', padding: '4px 8px' }}>Producto</th>
                                  <th style={{ textAlign: 'right', fontSize: '0.68rem', color: 'var(--muted)', padding: '4px 8px' }}>Cant.</th>
                                  <th style={{ textAlign: 'right', fontSize: '0.68rem', color: 'var(--muted)', padding: '4px 8px' }}>Costo Unit.</th>
                                  <th style={{ textAlign: 'right', fontSize: '0.68rem', color: 'var(--muted)', padding: '4px 8px' }}>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dets.map(d => {
                                  const prod = getProducto(d.id_producto);
                                  return (
                                    <tr key={d.id_detalle_compra} style={{ border: 'none' }}>
                                      <td style={{ padding: '4px 8px', fontSize: '0.82rem' }}>{prod?.nombre ?? '—'}</td>
                                      <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '0.82rem' }}>{d.cantidad}</td>
                                      <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '0.82rem', color: 'var(--muted)' }}>Bs {d.costo_unitario.toFixed(2)}</td>
                                      <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '0.82rem', color: 'var(--lilac-soft)' }}>Bs {d.subtotal.toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
