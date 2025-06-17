// Clase base para errores de la aplicación
/**
 * @class AppError
 * @extends Error
 * @description Clase base para todos los errores personalizados de la aplicación
 */
export class AppError extends Error {
  /**
   * @constructor
   * @param {number} statusCode - Código HTTP del error
   * @param {string} message - Mensaje descriptivo del error
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores de validación
/**
 * @class ValidationError
 * @extends AppError
 * @description Error para validaciones fallidas (400 Bad Request)
 */
export class ValidationError extends AppError {
  /**
   * @constructor
   * @param {string} message - Mensaje descriptivo del error de validación
   */
  constructor(message) {
    super(400, message);
    this.name = 'ValidationError';
  }
}

// Errores de autenticación
/**
 * @class AuthenticationError
 * @extends AppError
 * @description Error para fallos de autenticación (401 Unauthorized)
 */
export class AuthenticationError extends AppError {
  /**
   * @constructor
   * @param {string} message - Mensaje descriptivo del error de autenticación
   */
  constructor(message = 'No autorizado') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

// Errores de autorización
/**
 * @class AuthorizationError
 * @extends AppError
 * @description Error para fallos de autorización (403 Forbidden)
 */
export class AuthorizationError extends AppError {
  /**
   * @constructor
   * @param {string} message - Mensaje descriptivo del error de autorización
   */
  constructor(message = 'No tiene permisos para realizar esta acción') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

// Errores de recurso no encontrado
/**
 * @class NotFoundError
 * @extends AppError
 * @description Error para recursos no encontrados (404 Not Found)
 */
export class NotFoundError extends AppError {
  /**
   * @constructor
   * @param {string} resource - Nombre del recurso no encontrado
   */
  constructor(resource = 'recurso') {
    super(404, `${resource} no encontrado`);
    this.name = 'NotFoundError';
  }
}

// Errores de conflicto (por ejemplo, duplicados)
/**
 * @class ConflictError
 * @extends AppError
 * @description Error para conflictos de recursos (409 Conflict)
 */
export class ConflictError extends AppError {
  /**
   * @constructor
   * @param {string} message - Mensaje descriptivo del conflicto
   */
  constructor(message) {
    super(409, message);
    this.name = 'ConflictError';
  }
}

// Errores de base de datos
/**
 * @class DatabaseError
 * @extends AppError
 * @description Error para problemas con la base de datos (500 Internal Server Error)
 */
export class DatabaseError extends AppError {
  /**
   * @constructor
   * @param {string} message - Mensaje descriptivo del error de base de datos
   */
  constructor(message = 'Error en la base de datos') {
    super(500, message);
    this.name = 'DatabaseError';
  }
}