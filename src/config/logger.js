import winston from 'winston';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Crear directorio de logs si no existe
const logDir = join(process.cwd(), 'logs');
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'servicio-tecnico-api' },
  transports: [
    // Error logs
    new winston.transports.File({ 
      filename: join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({ 
      filename: join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Si no estamos en producción, también log a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;