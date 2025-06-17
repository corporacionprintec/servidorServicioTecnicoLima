import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import logger from './config/logger.js';
import { sequelize } from './models/index.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';

// ruta para clientes
import clienteRoutes from './routes/clienteRoutes.js';

// Importación de rutas organizada por categorías
// Rutas de API principal
import apiRoutes from './routes/index.js';

// Rutas de técnicos
import tecnicosRoutes from './routes/tecnicosRoutes.js';
import tecnicosRoutesAdmin from './routes/tecnicosRoutesAdmin.js';

// Rutas de dispositivos
import dispositivoRoutes from './routes/dispositivoRoutes.js';
import dispoScanUp from './routes/dispositivoRutesUpscan.js';

// Rutas de órdenes y servicios
import ordenServicioRoutes from './routes/ordenServicioRoutes.js';
import ordenServicioEstadoRoutes from './routes/ordenServicioEstadoRoutes.js';
import diagnosticoUpRoutes from './routes/diagnosticoUpRoutes.js';

// Rutas de datos y recursos
import dataRoutes from './routes/dataRoutes.js';
import comentarioRoutes from './routes/comentarioRoutes.js';
import repuestoRoutes from './routes/repuestoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import cierreCajaRoutes from './routes/cierreCajaRoutes.js';
const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
// Rutas de técnicos
//CRUD DE TECNICOS
app.use('/tecnicosAdmin', tecnicosRoutesAdmin);
//LOGIN
app.use('/api/tecnicos', tecnicosRoutes);


//Ruta para pagos
app.use('/api', pagoRoutes);
// Ruta para cierres de caja
app.use('/api/cierres-caja', cierreCajaRoutes);

// Rutas de clientes
app.use('/api/clientes', clienteRoutes);

// Rutas de dispositivos
app.use('/api/dispositivos', dispositivoRoutes);
app.use('/dispositivoscanup', dispoScanUp);

// Rutas de diagnósticos y órdenes
app.use('/api', diagnosticoUpRoutes);
app.use('/api/ordenes-servicioEstado', ordenServicioEstadoRoutes);

// Rutas de datos y recursos
app.use('/api/data', dataRoutes);
app.use('/upload', uploadRoutes);

// Rutas generales (incluye clientes, comentarios, etc.)
app.use(apiRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Servicio Técnico - Documentación',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showCommonExtensions: true
  }
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Manejadores de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Inicialización del servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Crear tablas si no existen, pero no modificar ni borrar nada existente
    await sequelize.sync();
    
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
