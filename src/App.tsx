import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Background } from './components/effects/Background';
import { Header }     from './components/layout/Header';
import { Footer }     from './components/layout/Footer';
import { Login }      from './pages/Login';
import { Dashboard }  from './pages/Dashboard';
import { POS }        from './pages/POS';
import { Productos }  from './pages/Productos';
import { Ventas }     from './pages/Ventas';
import { Compras }    from './pages/Compras';
import { Proveedores }from './pages/Proveedores';
import { CierreCajaPage } from './pages/CierreCaja';
import type { SesionUsuario } from './types/models';
import { MOCK_PRODUCTOS } from './data/mock';

// Mapeo de ruta → título del documento
const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/pos':         'Punto de Venta',
  '/ventas':      'Historial de Ventas',
  '/productos':   'Productos',
  '/compras':     'Compras',
  '/proveedores': 'Proveedores',
  '/cierre-caja': 'Cierre de Caja',
};

function AppLayout({ sesion, onLogout }: { sesion: SesionUsuario; onLogout: () => void }) {
  const stockAlerta = MOCK_PRODUCTOS.filter(p => p.estado && p.stock_actual < p.stock_minimo).length;
  const { pathname } = useLocation();
  const esAdmin = sesion.usuario.rol === 'ADMINISTRADOR';

  document.title = `${PAGE_TITLES[pathname] ?? 'Sistema POS'} · Librería El Rey`;

  return (
    <div className="layout">
      <Header sesion={sesion} onLogout={onLogout} stockAlerta={stockAlerta} />
      <main className="page-content" key={pathname}>
        <Routes>
          {/* Admin ve dashboard como inicio */}
          {esAdmin && <Route path="/dashboard"   element={<Dashboard sesion={sesion} />} />}
          <Route path="/pos"          element={<POS />} />
          <Route path="/ventas"       element={<Ventas />} />
          <Route path="/cierre-caja"  element={<CierreCajaPage sesion={sesion} />} />
          {/* Solo admin */}
          {esAdmin && <Route path="/productos"   element={<Productos />} />}
          {esAdmin && <Route path="/compras"     element={<Compras />} />}
          {esAdmin && <Route path="/proveedores" element={<Proveedores />} />}
          {/* Redirección por rol */}
          <Route path="*" element={<Navigate to={esAdmin ? '/dashboard' : '/pos'} replace />} />
        </Routes>
      </main>
      <Footer sesion={sesion} stockAlerta={stockAlerta} />
    </div>
  );
}

export default function App() {
  const [sesion, setSesion] = useState<SesionUsuario | null>(null);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* Fondo animado siempre presente */}
      <Background />

      {!sesion ? (
        <Login onLogin={setSesion} />
      ) : (
        <AppLayout sesion={sesion} onLogout={() => setSesion(null)} />
      )}
    </BrowserRouter>
  );
}
