import { useState } from 'react';
import { MOCK_PRODUCTOS, MOCK_CLIENTES } from '../data/mock';
import type { Producto, Cliente, DetalleVenta, MetodoPago } from '../types/models';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export function POS() {
  const [query, setQuery]           = useState('');
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [clienteId, setClienteId]   = useState<string>('');
  const [metodo, setMetodo]         = useState<MetodoPago>('EFECTIVO');
  const [ventaOk, setVentaOk]       = useState(false);
  const [ultimoTotal, setUltimoTotal] = useState(0);

  const productosFiltrados = MOCK_PRODUCTOS.filter(p =>
    p.estado && p.stock_actual > 0 &&
    (p.nombre.toLowerCase().includes(query.toLowerCase()) ||
     p.codigo_barras.includes(query))
  );

  function addToCart(prod: Producto) {
    setCart(prev => {
      const existe = prev.find(i => i.producto.id_producto === prod.id_producto);
      if (existe) {
        return prev.map(i =>
          i.producto.id_producto === prod.id_producto
            ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio_unitario }
            : i
        );
      }
      return [...prev, {
        producto: prod, cantidad: 1,
        precio_unitario: prod.precio_venta,
        subtotal: prod.precio_venta,
      }];
    });
    setQuery('');
  }

  function updateQty(idProducto: number, delta: number) {
    setCart(prev => prev
      .map(i => i.producto.id_producto === idProducto
        ? { ...i, cantidad: i.cantidad + delta, subtotal: (i.cantidad + delta) * i.precio_unitario }
        : i
      )
      .filter(i => i.cantidad > 0)
    );
  }

  const total = cart.reduce((s, i) => s + i.subtotal, 0);

  function finalizarVenta() {
    if (cart.length === 0) return;
    // Mock: simplemente confirmar
    const _detalles: Omit<DetalleVenta, 'id_detalle_venta' | 'id_venta'>[] = cart.map(i => ({
      id_producto: i.producto.id_producto,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
      subtotal: i.subtotal,
    }));
    console.log('[MOCK] Venta registrada:', { clienteId, metodo, total, detalles: _detalles });
    setUltimoTotal(total);
    setCart([]);
    setClienteId('');
    setMetodo('EFECTIVO');
    setVentaOk(true);
    // Efecto de partículas
    if ((window as any).FX) (window as any).FX.burst(window.innerWidth / 2, window.innerHeight / 2, {
      n: 30, power: 1.5, kinds: ['spark', 'spark'], size: 1.2,
    });
    setTimeout(() => setVentaOk(false), 3500);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Punto de Venta<i className="bi bi-cart3" /></h1>
          <p className="page-sub">Registra una nueva venta</p>
        </div>
      </div>

      {/* Notificación venta exitosa */}
      {ventaOk && (
        <div style={{
          marginBottom: 16, padding: '14px 18px', borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(34,100,60,0.35), rgba(10,50,30,0.5))',
          border: '1px solid rgba(52,211,153,0.4)',
          color: '#6ee7a0', fontWeight: 600, fontSize: '0.9rem',
          animation: 'slideUp 0.4s ease',
        }}>
          <i className="bi bi-check-circle-fill" /> Venta registrada exitosamente · Total: Bs {ultimoTotal.toFixed(2)}
        </div>
      )}

      <div className="pos-grid">
        {/* Panel izquierdo: búsqueda + productos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          {/* Búsqueda */}
          <div className="search-bar">
            <i className="bi bi-search" />
            <input
              placeholder="Buscar por nombre o código de barras…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Grid de productos */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {productosFiltrados.map(prod => (
                <button
                  key={prod.id_producto}
                  className="glass-card"
                  style={{
                    padding: 14, textAlign: 'left', cursor: 'pointer',
                    border: 'none', borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(160deg, rgba(24,12,48,0.72), rgba(10,6,22,0.78))',
                    borderColor: 'var(--line)',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                  }}
                  onClick={() => addToCart(prod)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 4, letterSpacing: '0.05em' }}>
                    {prod.categoria}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, marginBottom: 8, color: 'var(--ice)' }}>
                    {prod.nombre}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--f-display)', fontSize: '0.95rem', color: 'var(--lilac-soft)' }}>
                      Bs {prod.precio_venta.toFixed(2)}
                    </span>
                    <span className={`badge ${prod.stock_actual <= prod.stock_minimo ? 'badge-muted' : 'badge-green'}`}
                      style={{ fontSize: '0.62rem' }}>
                      {prod.stock_actual} uds
                    </span>
                  </div>
                </button>
              ))}
              {productosFiltrados.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: 32, fontSize: '0.9rem' }}>
                  No se encontraron productos
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div className="pos-cart">
          <div className="cart-header">
            Carrito
            {cart.length > 0 && (
              <span style={{ marginLeft: 8, color: 'var(--muted)', fontFamily: 'var(--f-body)', fontWeight: 400, fontSize: '0.75rem' }}>
                ({cart.length} {cart.length === 1 ? 'ítem' : 'ítems'})
              </span>
            )}
          </div>

          <div className="cart-items">
            {cart.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 16px', fontSize: '0.85rem' }}>
                <div className="empty-icon"><i className="bi bi-cart-x" /></div>
                Selecciona productos para agregarlos
              </div>
            )}
            {cart.map(item => (
              <div className="cart-item" key={item.producto.id_producto}>
                <div className="cart-item-name">
                  <div style={{ fontSize: '0.82rem' }}>{item.producto.nombre}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>
                    Bs {item.precio_unitario.toFixed(2)} c/u
                  </div>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQty(item.producto.id_producto, -1)} aria-label="Quitar uno"><i className="bi bi-dash" /></button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => updateQty(item.producto.id_producto, +1)} aria-label="Agregar uno"><i className="bi bi-plus" /></button>
                </div>
                <div className="cart-item-price">Bs {item.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            {/* Cliente */}
            <select
              className="select"
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '8px 12px' }}
            >
              <option value="">Sin cliente (venta directa)</option>
              {MOCK_CLIENTES.map((c: Cliente) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.razon_social} – {c.nit_ci}
                </option>
              ))}
            </select>

            {/* Método de pago */}
            <div style={{ display: 'flex', gap: 8 }}>
              {(['EFECTIVO', 'QR', 'TARJETA'] as MetodoPago[]).map(m => (
                <button
                  key={m}
                  className={`btn btn-sm ${metodo === m ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, fontSize: '0.72rem' }}
                  onClick={() => setMetodo(m)}
                >
                  <i className={`bi ${m === 'EFECTIVO' ? 'bi-cash-stack' : m === 'QR' ? 'bi-qr-code' : 'bi-credit-card'}`} /> {m}
                </button>
              ))}
            </div>

            {/* Total */}
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">Bs {total.toFixed(2)}</span>
            </div>

            {/* Botón finalizar */}
            <button
              className="btn btn-lilac btn-lg w-full"
              disabled={cart.length === 0}
              onClick={finalizarVenta}
              style={{ fontWeight: 700, letterSpacing: '0.06em' }}
            >
              <i className="bi bi-check2-circle" />Registrar Venta
            </button>
            {cart.length > 0 && (
              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={() => setCart([])}
                style={{ fontSize: '0.75rem' }}
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
