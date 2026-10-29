// ============================================================
// Datos mock – Sistema POS Librería El Rey
// Datos de demostración realistas para una librería boliviana
// ============================================================

import type {
  Usuario, CierreCaja, Producto, Cliente,
  Venta, DetalleVenta, Proveedor, Compra, DetalleCompra
} from '../types/models';

// ---------- Usuarios ----------
export const MOCK_USUARIOS: Usuario[] = [
  {
    id_usuario: 1,
    nombre_completo: 'Carlos Mendoza Quispe',
    username: 'admin',
    password_hash: 'hashed_admin_pass',
    rol: 'ADMINISTRADOR',
    estado: true,
  },
  {
    id_usuario: 2,
    nombre_completo: 'María Flores Condori',
    username: 'cajero1',
    password_hash: 'hashed_cajero1_pass',
    rol: 'CAJERO',
    estado: true,
  },
  {
    id_usuario: 3,
    nombre_completo: 'José Huanca Mamani',
    username: 'cajero2',
    password_hash: 'hashed_cajero2_pass',
    rol: 'CAJERO',
    estado: false,
  },
];

// ---------- Cierres de Caja ----------
export const MOCK_CIERRES: CierreCaja[] = [
  {
    id_cierre: 1,
    id_usuario: 2,
    fecha_apertura: '2026-10-28T08:00:00',
    fecha_cierre: '2026-10-28T18:30:00',
    monto_inicial: 500.00,
    monto_calculado: 3240.50,
    monto_real: 3235.00,
    diferencia: -5.50,
  },
  {
    id_cierre: 2,
    id_usuario: 2,
    fecha_apertura: '2026-10-29T08:00:00',
    fecha_cierre: null,
    monto_inicial: 500.00,
    monto_calculado: null,
    monto_real: null,
    diferencia: null,
  },
];

// ---------- Productos ----------
export const MOCK_PRODUCTOS: Producto[] = [
  { id_producto: 1,  codigo_barras: '9789563240450', nombre: 'Cien Años de Soledad',             categoria: 'Literatura',     precio_venta: 85.00,  stock_actual: 12, stock_minimo: 5,  estado: true  },
  { id_producto: 2,  codigo_barras: '9786070743665', nombre: 'El Principito',                     categoria: 'Literatura',     precio_venta: 45.00,  stock_actual: 3,  stock_minimo: 5,  estado: true  },
  { id_producto: 3,  codigo_barras: '9788420412146', nombre: 'Don Quijote de la Mancha',          categoria: 'Clásicos',       precio_venta: 120.00, stock_actual: 7,  stock_minimo: 3,  estado: true  },
  { id_producto: 4,  codigo_barras: '9786073162166', nombre: 'Harry Potter y la Piedra Filosofal',categoria: 'Fantasía',       precio_venta: 95.00,  stock_actual: 20, stock_minimo: 8,  estado: true  },
  { id_producto: 5,  codigo_barras: '9789877914207', nombre: 'Rayuela',                           categoria: 'Literatura',     precio_venta: 78.00,  stock_actual: 6,  stock_minimo: 4,  estado: true  },
  { id_producto: 6,  codigo_barras: '9786071676429', nombre: 'Matemáticas Básicas Universitarias',categoria: 'Educación',      precio_venta: 65.00,  stock_actual: 15, stock_minimo: 6,  estado: true  },
  { id_producto: 7,  codigo_barras: '9786073176286', nombre: 'Atlas del Mundo',                   categoria: 'Referencia',     precio_venta: 150.00, stock_actual: 2,  stock_minimo: 3,  estado: true  },
  { id_producto: 8,  codigo_barras: '9786070731037', nombre: 'Cuaderno Oxford A4 100 Hojas',      categoria: 'Papelería',      precio_venta: 18.00,  stock_actual: 80, stock_minimo: 20, estado: true  },
  { id_producto: 9,  codigo_barras: '9780307474278', nombre: 'La Sombra del Viento',              categoria: 'Misterio',       precio_venta: 88.00,  stock_actual: 4,  stock_minimo: 4,  estado: true  },
  { id_producto: 10, codigo_barras: '9789504945208', nombre: 'Yo el Supremo',                     categoria: 'Literatura',     precio_venta: 72.00,  stock_actual: 9,  stock_minimo: 3,  estado: true  },
  { id_producto: 11, codigo_barras: '9786075278230', nombre: 'Biología Celular y Molecular',      categoria: 'Ciencias',       precio_venta: 195.00, stock_actual: 1,  stock_minimo: 2,  estado: true  },
  { id_producto: 12, codigo_barras: '9786075100289', nombre: 'Historia de Bolivia',               categoria: 'Historia',       precio_venta: 55.00,  stock_actual: 22, stock_minimo: 5,  estado: true  },
  { id_producto: 13, codigo_barras: '9786073163064', nombre: 'El Hobbit',                         categoria: 'Fantasía',       precio_venta: 89.00,  stock_actual: 11, stock_minimo: 5,  estado: true  },
  { id_producto: 14, codigo_barras: '7501031318982', nombre: 'Bolígrafo BIC Azul (x10)',          categoria: 'Papelería',      precio_venta: 12.00,  stock_actual: 120,stock_minimo: 30, estado: true  },
  { id_producto: 15, codigo_barras: '9786073141765', nombre: 'Ingeniería de Software',            categoria: 'Tecnología',     precio_venta: 220.00, stock_actual: 0,  stock_minimo: 2,  estado: false },
];

// ---------- Clientes ----------
export const MOCK_CLIENTES: Cliente[] = [
  { id_cliente: 1, nit_ci: '1234567',    razon_social: 'Juan Pablo Ticona'        },
  { id_cliente: 2, nit_ci: '9876543',    razon_social: 'Ana Lucía Vargas Salinas'  },
  { id_cliente: 3, nit_ci: '4567890123', razon_social: 'Empresa Editorial Sur S.R.L.' },
  { id_cliente: 4, nit_ci: '7654321',    razon_social: 'Pedro Alvarado Choque'    },
  { id_cliente: 5, nit_ci: '3210987654', razon_social: 'Colegio San Francisco'    },
];

// ---------- Ventas ----------
export const MOCK_VENTAS: Venta[] = [
  { id_venta: 1, id_usuario: 2, id_cliente: 1,    fecha_venta: '2026-10-28T09:15:00', total: 163.00, metodo_pago: 'EFECTIVO' },
  { id_venta: 2, id_usuario: 2, id_cliente: null,  fecha_venta: '2026-10-28T10:30:00', total: 45.00,  metodo_pago: 'QR'       },
  { id_venta: 3, id_usuario: 2, id_cliente: 3,    fecha_venta: '2026-10-28T11:00:00', total: 850.00, metodo_pago: 'TARJETA'  },
  { id_venta: 4, id_usuario: 2, id_cliente: 2,    fecha_venta: '2026-10-28T13:45:00', total: 96.00,  metodo_pago: 'EFECTIVO' },
  { id_venta: 5, id_usuario: 2, id_cliente: null,  fecha_venta: '2026-10-28T14:20:00', total: 30.00,  metodo_pago: 'QR'       },
  { id_venta: 6, id_usuario: 2, id_cliente: 4,    fecha_venta: '2026-10-29T09:05:00', total: 207.00, metodo_pago: 'EFECTIVO' },
  { id_venta: 7, id_usuario: 2, id_cliente: 5,    fecha_venta: '2026-10-29T10:50:00', total: 1200.00,metodo_pago: 'TARJETA'  },
];

// ---------- Detalle de Ventas ----------
export const MOCK_DETALLES_VENTA: DetalleVenta[] = [
  { id_detalle_venta: 1,  id_venta: 1, id_producto: 1,  cantidad: 1, precio_unitario: 85.00,  subtotal: 85.00  },
  { id_detalle_venta: 2,  id_venta: 1, id_producto: 6,  cantidad: 1, precio_unitario: 65.00,  subtotal: 65.00  },
  { id_detalle_venta: 3,  id_venta: 1, id_producto: 14, cantidad: 1, precio_unitario: 12.00,  subtotal: 12.00  },
  { id_detalle_venta: 4,  id_venta: 2, id_producto: 2,  cantidad: 1, precio_unitario: 45.00,  subtotal: 45.00  },
  { id_detalle_venta: 5,  id_venta: 3, id_producto: 4,  cantidad: 5, precio_unitario: 95.00,  subtotal: 475.00 },
  { id_detalle_venta: 6,  id_venta: 3, id_producto: 13, cantidad: 3, precio_unitario: 89.00,  subtotal: 267.00 },
  { id_detalle_venta: 7,  id_venta: 3, id_producto: 8,  cantidad: 6, precio_unitario: 18.00,  subtotal: 108.00 },
  { id_detalle_venta: 8,  id_venta: 4, id_producto: 5,  cantidad: 1, precio_unitario: 78.00,  subtotal: 78.00  },
  { id_detalle_venta: 9,  id_venta: 4, id_producto: 14, cantidad: 1, precio_unitario: 12.00,  subtotal: 12.00  },
  { id_detalle_venta: 10, id_venta: 4, id_producto: 8,  cantidad: 3, precio_unitario: 18.00,  subtotal: 54.00  },
  { id_detalle_venta: 11, id_venta: 5, id_producto: 14, cantidad: 2, precio_unitario: 12.00,  subtotal: 24.00  },
  { id_detalle_venta: 12, id_venta: 5, id_producto: 8,  cantidad: 1, precio_unitario: 18.00,  subtotal: 18.00  },
  { id_detalle_venta: 13, id_venta: 6, id_producto: 3,  cantidad: 1, precio_unitario: 120.00, subtotal: 120.00 },
  { id_detalle_venta: 14, id_venta: 6, id_producto: 12, cantidad: 1, precio_unitario: 55.00,  subtotal: 55.00  },
  { id_detalle_venta: 15, id_venta: 6, id_producto: 14, cantidad: 1, precio_unitario: 12.00,  subtotal: 12.00  },
  { id_detalle_venta: 16, id_venta: 7, id_producto: 4,  cantidad: 8, precio_unitario: 95.00,  subtotal: 760.00 },
  { id_detalle_venta: 17, id_venta: 7, id_producto: 6,  cantidad: 5, precio_unitario: 65.00,  subtotal: 325.00 },
];

// ---------- Proveedores ----------
export const MOCK_PROVEEDORES: Proveedor[] = [
  { id_proveedor: 1, nit_proveedor: '1000012345',  nombre_empresa: 'Editorial Santillana Bolivia',   telefono: '2-2421567', direccion: 'Av. Arce 2345, La Paz' },
  { id_proveedor: 2, nit_proveedor: '2000098765',  nombre_empresa: 'Distribuidora Alfa S.R.L.',       telefono: '4-4321098', direccion: 'Calle Colón 456, Cochabamba' },
  { id_proveedor: 3, nit_proveedor: '3000045678',  nombre_empresa: 'Ediciones Plural Bolivia',        telefono: null,        direccion: 'Calle Comercio 1234, La Paz' },
  { id_proveedor: 4, nit_proveedor: '4000067890',  nombre_empresa: 'Papelería y Suministros JM',      telefono: '3-3340021', direccion: 'Av. Cañoto 890, Santa Cruz' },
];

// ---------- Compras ----------
export const MOCK_COMPRAS: Compra[] = [
  { id_compra: 1, id_usuario: 1, id_proveedor: 1, fecha_compra: '2026-10-15T10:00:00', total_compra: 2400.00 },
  { id_compra: 2, id_usuario: 1, id_proveedor: 4, fecha_compra: '2026-10-20T09:30:00', total_compra: 850.00  },
  { id_compra: 3, id_usuario: 1, id_proveedor: 2, fecha_compra: '2026-10-25T14:00:00', total_compra: 3100.00 },
];

// ---------- Detalles de Compras ----------
export const MOCK_DETALLES_COMPRA: DetalleCompra[] = [
  { id_detalle_compra: 1, id_compra: 1, id_producto: 1,  cantidad: 10, costo_unitario: 55.00, subtotal: 550.00  },
  { id_detalle_compra: 2, id_compra: 1, id_producto: 4,  cantidad: 20, costo_unitario: 62.00, subtotal: 1240.00 },
  { id_detalle_compra: 3, id_compra: 1, id_producto: 3,  cantidad: 8,  costo_unitario: 76.00, subtotal: 608.00  },
  { id_detalle_compra: 4, id_compra: 2, id_producto: 8,  cantidad: 50, costo_unitario: 10.00, subtotal: 500.00  },
  { id_detalle_compra: 5, id_compra: 2, id_producto: 14, cantidad: 50, costo_unitario: 7.00,  subtotal: 350.00  },
  { id_detalle_compra: 6, id_compra: 3, id_producto: 4,  cantidad: 30, costo_unitario: 60.00, subtotal: 1800.00 },
  { id_detalle_compra: 7, id_compra: 3, id_producto: 6,  cantidad: 15, costo_unitario: 42.00, subtotal: 630.00  },
  { id_detalle_compra: 8, id_compra: 3, id_producto: 13, cantidad: 8,  costo_unitario: 58.00, subtotal: 464.00  },
  { id_detalle_compra: 9, id_compra: 3, id_producto: 11, cantidad: 2,  costo_unitario: 103.00,subtotal: 206.00  },
];
