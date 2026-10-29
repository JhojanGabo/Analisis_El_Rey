import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { SesionUsuario } from '../../types/models';

interface HeaderProps {
  sesion: SesionUsuario;
  onLogout: () => void;
  stockAlerta: number; // productos bajo mínimo
}

interface NavDef {
  to: string;
  label: string;
  icon: string;          // clase de Bootstrap Icons
  soloAdmin?: boolean;
}

const NAV: NavDef[] = [
  { to: '/dashboard',   label: 'Dashboard',   icon: 'bi-grid-1x2',        soloAdmin: true },
  { to: '/pos',         label: 'Punto de Venta', icon: 'bi-cart3' },
  { to: '/ventas',      label: 'Ventas',      icon: 'bi-receipt' },
  { to: '/productos',   label: 'Productos',   icon: 'bi-book',            soloAdmin: true },
  { to: '/compras',     label: 'Compras',     icon: 'bi-box-seam',        soloAdmin: true },
  { to: '/proveedores', label: 'Proveedores', icon: 'bi-truck',           soloAdmin: true },
  { to: '/cierre-caja', label: 'Caja',        icon: 'bi-safe2' },
];

export function Header({ sesion, onLogout, stockAlerta }: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const esAdmin = sesion.usuario.rol === 'ADMINISTRADOR';
  const cajaAbierta = !!sesion.cierreActivo && !sesion.cierreActivo.fecha_cierre;

  // Cierra el menú móvil al navegar
  useEffect(() => { setMenuAbierto(false); }, [pathname]);

  // Sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = sesion.usuario.nombre_completo
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  const items = NAV.filter(n => !n.soloAdmin || esAdmin);

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        {/* Marca */}
        <NavLink to={esAdmin ? '/dashboard' : '/pos'} className="header-brand" aria-label="Inicio">
          <span className="header-brand-icon"><i className="bi bi-book-half" /></span>
          <span className="header-brand-text">
            <strong>El Rey</strong>
            <span>Sistema POS</span>
          </span>
        </NavLink>

        {/* Navegación */}
        <nav id="main-nav" className={`header-nav ${menuAbierto ? 'open' : ''}`} aria-label="Navegación principal">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              id={`nav-${item.to.slice(1)}`}
              className={({ isActive }) => `header-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
              {item.to === '/productos' && stockAlerta > 0 && (
                <span className="header-badge" title="Productos bajo stock mínimo">{stockAlerta}</span>
              )}
              {item.to === '/cierre-caja' && cajaAbierta && <span className="header-dot" title="Caja abierta" />}
            </NavLink>
          ))}
        </nav>

        {/* Lado derecho */}
        <div className="header-actions">
          <span className={`header-pill ${cajaAbierta ? 'caja-open' : 'caja-closed'}`}>
            <i className={`bi ${cajaAbierta ? 'bi-unlock-fill' : 'bi-lock-fill'}`} />
            <span className="header-pill-text">{cajaAbierta ? 'Caja abierta' : 'Caja cerrada'}</span>
          </span>

          <div className="header-user" title={sesion.usuario.nombre_completo}>
            <span className="header-avatar">{initials}</span>
            <span className="header-user-info">
              <strong>{sesion.usuario.nombre_completo.split(' ')[0]}</strong>
              <span>{sesion.usuario.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Cajero'}</span>
            </span>
          </div>

          <button id="btn-logout" className="header-icon-btn" onClick={onLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
            <i className="bi bi-box-arrow-right" />
          </button>

          <button
            id="btn-menu"
            className="header-icon-btn header-burger"
            onClick={() => setMenuAbierto(o => !o)}
            aria-expanded={menuAbierto}
            aria-controls="main-nav"
            aria-label="Abrir menú"
          >
            <i className={`bi ${menuAbierto ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
