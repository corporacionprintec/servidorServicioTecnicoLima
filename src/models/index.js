import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import databaseConfig from '../config/database.js';
import defineCliente from './cliente.js';
import defineDispositivo from './dispositivo.js';
import defineOrdenServicio from './ordenServicio.js';
import defineTecnico from './tecnico.js';
import defineRepuestoUsado from './repuestoUsado.js';
import definePago from './pago.js';
import defineComentario from './comentario.js';
import defineCierreCaja from './cierreCaja.js';
import defineUsuario from './usuario.js';
import defineAccesoAnonimo from './accesoAnonimo.js';
import defineGarantia from './garantia.js';

// Cargar variables de entorno
dotenv.config();

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

// Crear instancia de Sequelize
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Inicializar modelos
const db = {
  Cliente: defineCliente(sequelize),
  Dispositivo: defineDispositivo(sequelize),
  OrdenServicio: defineOrdenServicio(sequelize),
  Tecnico: defineTecnico(sequelize),
  RepuestoUsado: defineRepuestoUsado(sequelize),
  Pago: definePago(sequelize),
  Comentario: defineComentario(sequelize),
  CierreCaja: defineCierreCaja(sequelize),
  Usuario: defineUsuario(sequelize),
  AccesoAnonimo: defineAccesoAnonimo(sequelize),
  Garantia: defineGarantia(sequelize)
};

// Establecer asociaciones
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

export const {
  Cliente,
  Dispositivo,
  Comentario,
  OrdenServicio,
  Tecnico,
  RepuestoUsado,
  Pago,
  CierreCaja,
  Usuario,
  AccesoAnonimo,
  Garantia
} = db;

export default db;
