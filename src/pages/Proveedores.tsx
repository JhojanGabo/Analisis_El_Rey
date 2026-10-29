import { useState } from 'react';
import { MOCK_PROVEEDORES } from '../data/mock';
import type { Proveedor } from '../types/models';

export function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>(MOCK_PROVEEDORES);
  const [query, setQuery]     = useState('');
  const [modal, setModal]     = useState<Partial<Proveedor> | null>(null);
  const [edicion, setEdicion] = useState(false);

  const filtrados = proveedores.filter(p =>
    p.nombre_empresa.toLowerCase().includes(query.toLowerCase()) ||
    p.nit_proveedor.includes(query)
  );

  function abrirNuevo() {
    setModal({ nombre_empresa: '', nit_proveedor: '', telefono: '', direccion: '' });
    setEdicion(false);
  }

  function abrirEdicion(p: Proveedor) { setModal({ ...p }); setEdicion(true); }

  function guardar() {
    if (!modal?.nombre_empresa || !modal?.nit_proveedor) return;
    if (edicion) {
      setProveedores(prev => prev.map(p => p.id_proveedor === modal.id_proveedor ? { ...p, ...modal } as Proveedor : p));
    } else {
      const nuevo: Proveedor = {
        id_proveedor: Math.max(...proveedores.map(p => p.id_proveedor)) + 1,
        nit_proveedor: modal.nit_proveedor!,
        nombre_empresa: modal.nombre_empresa!,
        telefono: modal.telefono || null,
        direccion: modal.direccion || null,
      };
      setProveedores(prev => [nuevo, ...prev]);
    }
    setModal(null);
  }

  function eliminar(id: number) {
    if (confirm('¿Eliminar este proveedor?')) {
      setProveedores(prev => prev.filter(p => p.id_proveedor !== id));
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Proveedores<i className="bi bi-truck" /></h1>
          <p className="page-sub">{filtrados.length} proveedores registrados</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNuevo}><i className="bi bi-plus-lg" />Nuevo Proveedor</button>
      </div>

      <div className="search-bar" style={{ maxWidth: 320, marginBottom: 16 }}>
        <i className="bi bi-search" />
        <input placeholder="Nombre o NIT…" value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="glass-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NIT</th>
                <th>Empresa</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(prov => (
                <tr key={prov.id_proveedor}>
                  <td><code style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{prov.nit_proveedor}</code></td>
                  <td style={{ fontWeight: 500 }}>{prov.nombre_empresa}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{prov.telefono ?? '—'}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.82rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prov.direccion ?? '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => abrirEdicion(prov)} title="Editar" aria-label="Editar"><i className="bi bi-pencil-square" /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => eliminar(prov.id_proveedor)} title="Eliminar" aria-label="Eliminar"><i className="bi bi-trash3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <span className="modal-title">{edicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}</span>
              <button className="modal-close" onClick={() => setModal(null)} aria-label="Cerrar"><i className="bi bi-x-lg" /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label>Nombre de la Empresa *</label>
                <input className="input" value={modal.nombre_empresa || ''} onChange={e => setModal(m => ({ ...m, nombre_empresa: e.target.value }))} placeholder="Ej: Editorial Santillana" />
              </div>
              <div className="field">
                <label>NIT del Proveedor *</label>
                <input className="input" value={modal.nit_proveedor || ''} onChange={e => setModal(m => ({ ...m, nit_proveedor: e.target.value }))} placeholder="Ej: 1234567890" />
              </div>
              <div className="field">
                <label>Teléfono</label>
                <input className="input" value={modal.telefono || ''} onChange={e => setModal(m => ({ ...m, telefono: e.target.value }))} placeholder="Ej: 2-2421567" />
              </div>
              <div className="field">
                <label>Dirección</label>
                <input className="input" value={modal.direccion || ''} onChange={e => setModal(m => ({ ...m, direccion: e.target.value }))} placeholder="Calle, ciudad…" />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardar}>{edicion ? 'Guardar' : 'Crear Proveedor'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
