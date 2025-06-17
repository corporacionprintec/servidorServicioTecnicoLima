// src/middleware/uploadMiddleware.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Tipos de archivos permitidos por defecto
const DEFAULT_ALLOWED_TYPES = {
  'image': ['image/jpeg', 'image/png', 'image/gif'],
  'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-m4a','audio/webm'],
  'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'pdf': ['application/pdf'],
  'any': null // permite cualquier tipo
};

// Límites por defecto
const DEFAULT_LIMITS = {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 1
};

// Función para crear directorios si no existen
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

/**
 * Crea una configuración de Multer personalizada
 * @param {Object} options Opciones de configuración
 * @param {string} options.destination Directorio destino para los archivos
 * @param {string|string[]} options.allowedTypes Tipos de archivo permitidos ('image', 'audio', 'document', 'any' o array de mimetypes)
 * @param {Object} options.limits Límites personalizados (fileSize, files)
 * @param {Function} options.filenameGenerator Función personalizada para generar nombres de archivo
 * @returns {Object} Middleware de Multer configurado
 */
export const createUploadMiddleware = (options = {}) => {
  const {
    destination = 'uploads/general',
    allowedTypes = ['any'],
    limits = DEFAULT_LIMITS,
    filenameGenerator = (file) => `${uuidv4()}${path.extname(file.originalname)}`
  } = options;

  // Asegurarse de que el directorio existe
  ensureDirectoryExists(destination);

  // Configuración del almacenamiento
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, filenameGenerator(file));
    }
  });

  // Filtro de archivos
  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes('any')) {
      return cb(null, true);
    }

    const allowedMimetypes = allowedTypes.reduce((types, type) => {
      if (DEFAULT_ALLOWED_TYPES[type]) {
        return [...types, ...DEFAULT_ALLOWED_TYPES[type]];
      }
      return [...types, type];
    }, []);

    if (allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido. Tipos permitidos: ${allowedMimetypes.join(', ')}`), false);
    }
  };

  // Crear y retornar el middleware
  return multer({
    storage,
    fileFilter,
    limits
  });
};

// Middlewares preconfigurados comunes
export const uploadMiddleware = {
  // Para imágenes
  image: createUploadMiddleware({
    destination: 'uploads/images',
    allowedTypes: ['image'],
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }),

  // Para audio
  audio: createUploadMiddleware({
    destination: 'uploads/audio',
    allowedTypes: ['audio'],
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  }),

  // Para documentos
  document: createUploadMiddleware({
    destination: 'uploads/documents',
    allowedTypes: ['document'],
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
  }),

  // Específicamente para PDFs (recibos)
  pdf: createUploadMiddleware({
    destination: 'uploads/pdf',
    allowedTypes: ['pdf'],
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
  }),

  // Para múltiples archivos
  multiple: createUploadMiddleware({
    destination: 'uploads/multiple',
    allowedTypes: ['any'],
    limits: { 
      fileSize: 10 * 1024 * 1024,
      files: 5 
    }
  })
};