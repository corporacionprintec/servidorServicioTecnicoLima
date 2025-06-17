import logger from '../config/logger.js';
import { NotFoundError, AppError } from './errors.js';

/**
 * @function errorHandler
 * @description Middleware central para manejo de errores
 * @param {Error} err - Error capturado
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log del error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Si es un error personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Error por defecto
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * @function notFoundHandler
 * @description Middleware para manejar rutas no encontradas
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
export const notFoundHandler = (req, res, next) => {
  const message = `No se encontró la ruta: ${req.originalUrl}`;
  next(new NotFoundError(message));
};