import { useState } from 'react';
import { MOCK_VENTAS, MOCK_DETALLES_VENTA, MOCK_PRODUCTOS, MOCK_USUARIOS, MOCK_CLIENTES } from '../data/mock';

const METODO_ICON: Record<string, string> = { EFECTIVO: 'bi-cash-stack', QR: 'bi-qr-code', TARJETA: 'bi-credit-card' };

export function Ventas() {
  const [filtroFecha, setFiltroFecha] = useState('');
  const [expandida, setExpandida]     = useState<number | null>(null);

  const ventasFiltradas = MOCK_VENTAS
    .filter(v => !filtroFecha || v.fecha_venta.startsWith(filtroFecha))
    .sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta));

  const totalFiltrado = ventasFiltradas.reduce((s, v) => s + v.total, 0);

  function getUsuario(id: number) { return MOCK_USUARIOS.find(u => u.id_usuario === id); }
  function getCliente(id: number | null) { return id ? MOCK_CLIENTES.find(c => c.id_cliente === id) : null; }
  function getDetalles(idVenta: number) { return MOCK_DETALLES_VENTA.filter(d => d.id_venta === idVenta); }
  function getProducto(id: number) { return MOCK_PRODUCTOS.find(p => p.id_producto === id); }

  function fmtDatetime(iso: string) {
    return new Date(iso).toLocaleString('es-BO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Historial de Ventas<i className="bi bi-receipt" /></h1>
          <p className="page-sub">{ventasFiltradas.length} ventas · Total: Bs {totalFiltrado.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtro fecha */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <label style={{ whiteSpace: 'nowrap', textTransform: 'none', letterSpacing: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
            <i className="bi bi-calendar3" /> Fecha:
          </label>
          <input
            className="input"
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            style={{ maxWidth: 160, padding: '8px 12px' }}
          />
        </div>
        {filtroFecha && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFiltroFecha('')}><i className="bi bi-x-lg" />Limpiar</button>
        )}
      </div>

      {/* Tabla de ventas */}
      <div className="glass-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Cajero</th>
                <th>Cliente</th>
                <th>Método</th>
                <th>Total</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map(venta => {
                const usuario  = getUsuario(venta.id_usuario);
                const cliente  = getCliente(venta.id_cliente);
                const detalles = getDetalles(venta.id_venta);
                const isOpen   = expandida === venta.id_venta;

                return (
                  <>
                    <tr key={venta.id_venta}>
                      <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>#{venta.id_venta}</td>
                      <td style={{ fontSize: '0.82rem' }}>{fmtDatetime(venta.fecha_venta)}</td>
                      <td style={{ fontSize: '0.82rem' }}>{usuario?.nombre_completo ?? '—'}</td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {cliente ? (
                          <div>
                            <div>{cliente.razon_social}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{cliente.nit_ci}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Sin factura</span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-muted">
                          <i className={`bi ${METODO_ICON[venta.metodo_pago]}`} /> {venta.metodo_pago}
                        </span>
                      </td>
                      <td style={{ color: 'var(--lilac-soft)', fontFamily: 'var(--f-display)', fontSize: '0.9rem' }}>
                        Bs {venta.total.toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setExpandida(isOpen ? null : venta.id_venta)}
                        >
                          <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} /> {detalles.length} ítems
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${venta.id_venta}-det`}>
                        <td colSpan={7} style={{ padding: '0 0 8px 32px' }}>
                          <div style={{
                            background: 'rgba(124,58,237,0.1)',
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
                                  <th style={{ textAlign: 'right', fontSize: '0.68rem', color: 'var(--muted)', padding: '4px 8px' }}>P. Unit.</th>
                                  <th style={{ textAlign: 'right', fontSize: '0.68rem', color: 'var(--muted)', padding: '4px 8px' }}>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detalles.map(d => {
                                  const prod = getProducto(d.id_producto);
                                  return (
                                    <tr key={d.id_detalle_venta} style={{ border: 'none' }}>
                                      <td style={{ padding: '4px 8px', fontSize: '0.82rem' }}>{prod?.nombre ?? '—'}</td>
                                      <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '0.82rem' }}>{d.cantidad}</td>
                                      <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '0.82rem', color: 'var(--muted)' }}>Bs {d.precio_unitario.toFixed(2)}</td>
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
