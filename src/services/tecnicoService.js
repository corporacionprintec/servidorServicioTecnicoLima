import { Tecnico } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

/**
 * @class TecnicoService
 * @description Servicio para gestionar los técnicos
 */
export class TecnicoService {
  /**
   * Obtiene todos los técnicos
   * @returns {Promise<Array>} Lista de técnicos
   */
  async getAllTecnicos() {
    try {
      const tecnicos = await Tecnico.findAll({ attributes: { exclude: [] } });
      return tecnicos;
    } catch (error) {
      logger.error('Error al obtener técnicos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un técnico por su ID
   * @param {number} id - ID del técnico
   * @returns {Promise<Tecnico>} Técnico encontrado
   */
  async getTecnicoById(id) {
    const tecnico = await Tecnico.findByPk(id, { attributes: { exclude: [] } });
    
    if (!tecnico) {
      throw new NotFoundError(`No se encontró el técnico con ID: ${id}`);
    }
    
    return tecnico;
  }

  /**
   * Crea un nuevo técnico
   * @param {Object} data - Datos del técnico
   * @returns {Promise<Tecnico>} Técnico creado
   */
  async createTecnico(data) {
    try {
      const { nombre, apellido, telefono, contrasena, rol } = data;
      
      const tecnico = await Tecnico.create({
        nombre,
        apellido,
        telefono,
        contrasena,
        rol
      });
      
      logger.info(`Técnico creado con ID: ${tecnico.id}`);
      return tecnico;
    } catch (error) {
      logger.error('Error al crear técnico:', error);
      throw error;
    }
  }

  /**
   * Actualiza un técnico
   * @param {number} id - ID del técnico
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Tecnico>} Técnico actualizado
   */
  async updateTecnico(id, data) {
    const tecnico = await this.getTecnicoById(id);
    
    await tecnico.update(data);
    logger.info(`Técnico ${id} actualizado`);
    
    return tecnico;
  }

  /**
   * Elimina un técnico
   * @param {number} id - ID del técnico
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async deleteTecnico(id) {
    const tecnico = await this.getTecnicoById(id);
    
    await tecnico.destroy();
    logger.info(`Técnico ${id} eliminado`);
    
    return true;
  }
}

export default new TecnicoService();