// ============================================================
// Interfaces TypeScript – Sistema POS Librería El Rey
// Derivadas 1:1 del modelo Entidad-Relación del proyecto
// ============================================================

// ---------- Módulo Seguridad & Caja ----------

export type RolUsuario = 'CAJERO' | 'ADMINISTRADOR';

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  username: string;
  password_hash: string;
  rol: RolUsuario;
  estado: boolean; // baja lógica
}

export interface CierreCaja {
  id_cierre: number;
  id_usuario: number;
  fecha_apertura: string; // ISO timestamp
  fecha_cierre: string | null;
  monto_inicial: number;
  monto_calculado: number | null;
  monto_real: number | null;
  diferencia: number | null;
}

// ---------- Módulo Inventario ----------

export interface Producto {
  id_producto: number;
  codigo_barras: string;
  nombre: string;
  categoria: string;
  precio_venta: number;
  stock_actual: number;  // CHECK stock_actual >= 0
  stock_minimo: number;
  estado: boolean; // baja lógica
}

// ---------- Módulo Ventas ----------

export interface Cliente {
  id_cliente: number;
  nit_ci: string;
  razon_social: string;
}

export type MetodoPago = 'EFECTIVO' | 'QR' | 'TARJETA';

export interface Venta {
  id_venta: number;
  id_usuario: number;
  id_cliente: number | null; // FK nula = venta sin factura
  fecha_venta: string; // ISO timestamp
  total: number;
  metodo_pago: MetodoPago;
}

export interface DetalleVenta {
  id_detalle_venta: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;   // CHECK cantidad > 0
  precio_unitario: number; // precio histórico al momento de venta
  subtotal: number;
}

// ---------- Módulo Compras ----------

export interface Proveedor {
  id_proveedor: number;
  nit_proveedor: string;
  nombre_empresa: string;
  telefono: string | null;
  direccion: string | null;
}

export interface Compra {
  id_compra: number;
  id_usuario: number; // admin que registró
  id_proveedor: number;
  fecha_compra: string; // ISO timestamp
  total_compra: number;
}

export interface DetalleCompra {
  id_detalle_compra: number;
  id_compra: number;
  id_producto: number;
  cantidad: number;       // CHECK cantidad > 0
  costo_unitario: number; // costo histórico de adquisición
  subtotal: number;
}

// ---------- Tipos de sesión (solo frontend) ----------

export interface SesionUsuario {
  usuario: Omit<Usuario, 'password_hash'>;
  cierreActivo: CierreCaja | null;
}
