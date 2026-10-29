import type { SesionUsuario } from '../../types/models';

interface FooterProps {
  sesion: SesionUsuario;
  stockAlerta: number;
}

export function Footer({ sesion, stockAlerta }: FooterProps) {
  const hoy = new Date().toLocaleDateString('es-BO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const cajaAbierta = !!sesion.cierreActivo && !sesion.cierreActivo.fecha_cierre;

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <i className="bi bi-book-half" />
          <span><strong>Librería El Rey</strong> · Sistema de Punto de Venta e Inventarios</span>
        </div>

        <ul className="footer-status" aria-label="Estado del sistema">
          <li><i className="bi bi-calendar3" /> {hoy}</li>
          <li className={cajaAbierta ? 'ok' : 'warn'}>
            <i className={`bi ${cajaAbierta ? 'bi-check-circle' : 'bi-dash-circle'}`} />
            {cajaAbierta ? `Caja abierta · Bs ${sesion.cierreActivo!.monto_inicial.toFixed(2)}` : 'Caja cerrada'}
          </li>
          {stockAlerta > 0 && (
            <li className="warn"><i className="bi bi-exclamation-triangle" /> {stockAlerta} con stock bajo</li>
          )}
          <li className="muted"><i className="bi bi-database" /> Datos de demostración</li>
        </ul>

        <div className="footer-copy">
          © {new Date().getFullYear()} El Rey · v0.1.0
        </div>
      </div>
    </footer>
  );
}
