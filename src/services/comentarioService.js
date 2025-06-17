import { Comentario } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

/**
 * @class ComentarioService
 * @description Servicio para gestionar los comentarios de las órdenes de servicio
 */
export class ComentarioService {
  /**
   * Crear un nuevo comentario
   * @param {Object} comentarioData - Datos del comentario
   * @param {number} comentarioData.orden_id - ID de la orden de servicio asociada
   * @param {string} [comentarioData.autor] - Nombre del autor del comentario
   * @param {string} comentarioData.tipo - Tipo de comentario ('texto' o 'audio')
   * @param {string} [comentarioData.contenido] - Contenido del comentario si es tipo texto
   * @param {string} [comentarioData.url_audio] - URL del archivo de audio si es tipo audio
   * @param {string} [comentarioData.audio_id] - ID del archivo de audio en el sistema de almacenamiento
   * @param {Object} [options] - Opciones de Sequelize (como transaction)
   * @returns {Promise<Comentario>} Comentario creado
   * @throws {ValidationError} Si faltan datos requeridos o son inválidos
   * @throws {NotFoundError} Si la orden de servicio no existe
   */
  async createComentario(comentarioData, options = {}) {
    try {
      // Validar datos requeridos
      if (!comentarioData.orden_id) {
        throw new ValidationError('El ID de la orden de servicio es requerido');
      }
      if (!comentarioData.tipo) {
        throw new ValidationError('El tipo de comentario es requerido');
      }
      if (!['texto', 'audio'].includes(comentarioData.tipo)) {
        throw new ValidationError('El tipo de comentario debe ser texto o audio');
      }

      // Validar según el tipo de comentario
      if (comentarioData.tipo === 'texto' && !comentarioData.contenido) {
        throw new ValidationError('El contenido es requerido para comentarios de texto');
      }
      if (comentarioData.tipo === 'audio' && !comentarioData.url_audio) {
        throw new ValidationError('La URL del audio es requerida para comentarios de audio');
      }

      // Crear el comentario
      await Comentario.create(comentarioData, options);
    } catch (error) {
      logger.error('Error al crear comentario:', error);
      throw error;
    }
  }

  /**
   * Obtener un comentario por su ID
   * @param {number} id - ID del comentario
   * @param {Object} [options] - Opciones de Sequelize (como transaction)
   * @returns {Promise<Comentario>} Comentario encontrado
   * @throws {NotFoundError} Si el comentario no existe
   */
  async getComentarioById(id, options = {}) {
    try {
      const comentario = await Comentario.findByPk(id, options);
      if (!comentario) {
        throw new NotFoundError('Comentario no encontrado');
      }
      return comentario;
    } catch (error) {
      logger.error('Error al obtener comentario:', error);
      throw error;
    }
  }

  /**
   * Eliminar un comentario
   * @param {number} id - ID del comentario a eliminar
   * @param {Object} [options] - Opciones de Sequelize (como transaction)
   * @returns {Promise<boolean>} true si se eliminó correctamente
   * @throws {NotFoundError} Si el comentario no existe
   */
  async deleteComentarioById(id, options = {}) {
    try {
      const deleted = await Comentario.destroy({
        where: { id },
        ...options
      });

      if (!deleted) {
        throw new NotFoundError('Comentario no encontrado');
      }
      return true;
    } catch (error) {
      logger.error('Error al eliminar comentario:', error);
      throw error;
    }
  }
}