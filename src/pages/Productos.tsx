import { useState } from 'react';
import { MOCK_PRODUCTOS } from '../data/mock';
import type { Producto } from '../types/models';

export function Productos() {
  const [productos, setProductos] = useState<Producto[]>(MOCK_PRODUCTOS);
  const [query, setQuery]         = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado]       = useState<'todos' | 'activos' | 'bajos' | 'inactivos'>('todos');
  const [modal, setModal]         = useState<Partial<Producto> | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const categorias = [...new Set(MOCK_PRODUCTOS.map(p => p.categoria))].sort();

  const filtrados = productos.filter(p => {
    const matchQuery = p.nombre.toLowerCase().includes(query.toLowerCase()) ||
                       p.codigo_barras.includes(query);
    const matchCat  = !filtroCategoria || p.categoria === filtroCategoria;
    const matchEst  = filtroEstado === 'todos'     ? true
                    : filtroEstado === 'activos'   ? p.estado
                    : filtroEstado === 'inactivos' ? !p.estado
                    : filtroEstado === 'bajos'     ? p.estado && p.stock_actual < p.stock_minimo
                    : true;
    return matchQuery && matchCat && matchEst;
  });

  function abrirNuevo() {
    setModal({ nombre: '', codigo_barras: '', categoria: '', precio_venta: 0, stock_actual: 0, stock_minimo: 5, estado: true });
    setModoEdicion(false);
  }

  function abrirEdicion(prod: Producto) {
    setModal({ ...prod });
    setModoEdicion(true);
  }

  function guardar() {
    if (!modal?.nombre || !modal?.codigo_barras) return;
    if (modoEdicion) {
      setProductos(prev => prev.map(p => p.id_producto === modal.id_producto ? { ...p, ...modal } as Producto : p));
    } else {
      const nuevo: Producto = {
        id_producto: Math.max(...productos.map(p => p.id_producto)) + 1,
        nombre: modal.nombre!,
        codigo_barras: modal.codigo_barras!,
        categoria: modal.categoria || 'General',
        precio_venta: modal.precio_venta || 0,
        stock_actual: modal.stock_actual || 0,
        stock_minimo: modal.stock_minimo || 5,
        estado: true,
      };
      setProductos(prev => [nuevo, ...prev]);
    }
    setModal(null);
  }

  function toggleEstado(id: number) {
    setProductos(prev => prev.map(p => p.id_producto === id ? { ...p, estado: !p.estado } : p));
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Productos<i className="bi bi-book" /></h1>
          <p className="page-sub">{filtrados.length} de {productos.length} productos</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNuevo}><i className="bi bi-plus-lg" />Nuevo Producto</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ maxWidth: 300 }}>
          <i className="bi bi-search" />
          <input placeholder="Nombre o código…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="select" style={{ maxWidth: 180 }} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['todos', 'activos', 'bajos', 'inactivos'] as const).map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filtroEstado === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFiltroEstado(f)}
              style={{ textTransform: 'capitalize' }}
            >
              {f === 'bajos' ? <><i className="bi bi-exclamation-triangle" />Bajo stock</> : f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="glass-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Mín.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(prod => {
                const stockBajo = prod.stock_actual < prod.stock_minimo;
                const sinStock  = prod.stock_actual === 0;
                return (
                  <tr key={prod.id_producto}>
                    <td><code style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{prod.codigo_barras}</code></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{prod.nombre}</div>
                    </td>
                    <td><span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{prod.categoria}</span></td>
                    <td style={{ color: 'var(--lilac-soft)', fontFamily: 'var(--f-display)', fontSize: '0.9rem' }}>
                      Bs {prod.precio_venta.toFixed(2)}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: sinStock ? '#f87171' : stockBajo ? '#fbbf24' : '#6ee7a0',
                      }}>
                        {prod.stock_actual}
                        {stockBajo && !sinStock && <> <i className="bi bi-exclamation-triangle-fill" /></>}
                        {sinStock && <> <i className="bi bi-slash-circle" /></>}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{prod.stock_minimo}</td>
                    <td>
                      <span className={`badge ${prod.estado ? 'badge-green' : 'badge-red'}`}>
                        {prod.estado ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => abrirEdicion(prod)} title="Editar" aria-label="Editar"><i className="bi bi-pencil-square" /></button>
                        <button
                          className={`btn btn-sm ${prod.estado ? 'btn-danger' : 'btn-ghost'}`}
                          onClick={() => toggleEstado(prod.id_producto)}
                          title={prod.estado ? 'Dar de baja' : 'Reactivar'}
                        >
                          <i className={`bi ${prod.estado ? 'bi-slash-circle' : 'bi-check-circle'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <span className="modal-title">{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</span>
              <button className="modal-close" onClick={() => setModal(null)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label>Nombre del Producto *</label>
                  <input className="input" value={modal.nombre || ''} onChange={e => setModal(m => ({ ...m, nombre: e.target.value }))} placeholder="Ej: Cien años de soledad" />
                </div>
                <div className="field">
                  <label>Código de Barras *</label>
                  <input className="input" value={modal.codigo_barras || ''} onChange={e => setModal(m => ({ ...m, codigo_barras: e.target.value }))} placeholder="ISBN / EAN" />
                </div>
                <div className="field">
                  <label>Categoría</label>
                  <input className="input" value={modal.categoria || ''} onChange={e => setModal(m => ({ ...m, categoria: e.target.value }))} placeholder="Literatura, Educación…" list="cats" />
                  <datalist id="cats">{categorias.map(c => <option key={c} value={c} />)}</datalist>
                </div>
                <div className="field">
                  <label>Precio de Venta (Bs)</label>
                  <input className="input" type="number" min="0.01" step="0.01" value={modal.precio_venta || ''} onChange={e => setModal(m => ({ ...m, precio_venta: +e.target.value }))} />
                </div>
                <div className="field">
                  <label>Stock Actual</label>
                  <input className="input" type="number" min="0" value={modal.stock_actual ?? ''} onChange={e => setModal(m => ({ ...m, stock_actual: +e.target.value }))} />
                </div>
                <div className="field">
                  <label>Stock Mínimo</label>
                  <input className="input" type="number" min="0" value={modal.stock_minimo ?? ''} onChange={e => setModal(m => ({ ...m, stock_minimo: +e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardar}>
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
