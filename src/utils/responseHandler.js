/**
 * @class ApiResponse
 * @description Clase base para estructurar respuestas exitosas de la API
 */
export class ApiResponse {
  /**
   * @constructor
   * @param {any} data - Datos a devolver en la respuesta
   * @param {string} message - Mensaje descriptivo de la operación
   * @param {Object} metadata - Metadatos adicionales
   */
  constructor(data = null, message = 'Operación exitosa', metadata = {}) {
    this.status = 'success';
    this.message = message;
    this.data = data;
    this.metadata = metadata;
  }
}

/**
 * @class PaginatedResponse
 * @extends ApiResponse
 * @description Clase para estructurar respuestas paginadas
 */
export class PaginatedResponse extends ApiResponse {
  /**
   * @constructor
   * @param {Array} data - Array de datos a paginar
   * @param {number} page - Número de página actual
   * @param {number} limit - Cantidad de items por página
   * @param {number} total - Total de items
   * @param {string} message - Mensaje descriptivo
   */
  constructor(data, page, limit, total, message = 'Operación exitosa') {
    super(data, message, {
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }
}

/**
 * @namespace responseHandler
 * @description Utilidades para manejar respuestas HTTP de manera consistente
 */
export const responseHandler = {
  /**
   * @function success
   * @description Envía una respuesta exitosa
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos a enviar
   * @param {string} message - Mensaje descriptivo
   * @param {number} statusCode - Código HTTP
   * @returns {Object} Respuesta HTTP
   */
  success: (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
    const response = new ApiResponse(data, message);
    return res.status(statusCode).json(response);
  },

  /**
   * @function created
   * @description Envía una respuesta de recurso creado
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos del recurso creado
   * @param {string} message - Mensaje descriptivo
   * @returns {Object} Respuesta HTTP
   */
  created: (res, data, message = 'Recurso creado exitosamente') => {
    const response = new ApiResponse(data, message);
    return res.status(201).json(response);
  },

  /**
   * @function paginated
   * @description Envía una respuesta paginada
   * @param {Object} res - Objeto response de Express
   * @param {Array} data - Array de datos
   * @param {number} page - Página actual
   * @param {number} limit - Items por página
   * @param {number} total - Total de items
   * @param {string} message - Mensaje descriptivo
   * @returns {Object} Respuesta HTTP paginada
   */
  paginated: (res, data, page, limit, total, message = 'Operación exitosa') => {
    const response = new PaginatedResponse(data, page, limit, total, message);
    return res.status(200).json(response);
  },

  /**
   * @function updated
   * @description Envía una respuesta de recurso actualizado
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos actualizados
   * @param {string} message - Mensaje descriptivo
   * @returns {Object} Respuesta HTTP
   */
  updated: (res, data, message = 'Recurso actualizado exitosamente') => {
    const response = new ApiResponse(data, message);
    return res.status(200).json(response);
  },

  /**
   * @function deleted
   * @description Envía una respuesta de recurso eliminado
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos eliminados (opcional)
   * @param {string} message - Mensaje descriptivo
   * @returns {Object} Respuesta HTTP
   */
  deleted: (res, data = null, message = 'Recurso eliminado exitosamente') => {
    const response = new ApiResponse(data, message);
    return res.status(200).json(response);
  },

  /**
   * @function noContent
   * @description Envía una respuesta sin contenido
   * @param {Object} res - Objeto response de Express
   * @returns {Object} Respuesta HTTP 204
   */
  noContent: (res) => {
    return res.status(204).send();
  },

  /**
   * @function badRequest
   * @description Envía una respuesta de solicitud incorrecta (400)
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos adicionales (opcional)
   * @param {string} message - Mensaje descriptivo del error
   * @returns {Object} Respuesta HTTP con error 400
   */
  badRequest: (res, data = null, message = 'Solicitud incorrecta') => {
    const response = {
      status: 'error',
      message,
      data
    };
    return res.status(400).json(response);
  }
};
