import { Op } from 'sequelize';
import { OrdenServicio, Cliente, Dispositivo, Tecnico, RepuestoUsado, Pago } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

/**
 * @class RepuestoService
 * @description Servicio para gestionar los repuestos usados
 */
export class RepuestoService {
  /**
   * Crear un nuevo repuesto usado
   * @param {Object} repuestoData - Datos del repuesto
   * @param {number} repuestoData.orden_id - ID de la orden de servicio
   * @param {string} repuestoData.repuesto_nombre - Nombre del repuesto
   * @param {number} repuestoData.cantidad - Cantidad del repuesto
   * @param {Object} [options] - Opciones de Sequelize (como transaction)
   * @returns {Promise<RepuestoUsado>}
   */
  async createRepuesto(repuestoData, options = {}) {
    try {
      // Validar datos requeridos
      if (!repuestoData.orden_id) throw new ValidationError('El ID de la orden de servicio es requerido');
      if (!repuestoData.repuesto_nombre) throw new ValidationError('El nombre del repuesto es requerido');
      if (!repuestoData.cantidad) throw new ValidationError('La cantidad del repuesto es requerida');

      // Verificar que exista la orden de servicio  verificar en controlador
      /* const orden = await OrdenServicio.findByPk(repuestoData.orden_servicio_id, options);
      if (!orden) throw new NotFoundError('Orden de servicio no encontrada'); */

      // Crear el repuesto usado
      const repuesto = await RepuestoUsado.create({
        orden_id: repuestoData.orden_id,
        repuesto_nombre: repuestoData.repuesto_nombre,
        cantidad: repuestoData.cantidad
      }, options);
      return repuesto;
    } catch (error) {
      logger.error('Error al crear repuesto usado:', error);
      throw error;
    }
  }

  /**
   * Obtener un repuesto usado por su ID
   * @param {number} id - ID del repuesto usado
   * @param {Object} [options] - Opciones de Sequelize (como transaction)
   * @returns {Promise<RepuestoUsado>}
   */
  async getRepuestoById(id, options = {}) {
    try {
      const repuesto = await RepuestoUsado.findByPk(id, options);
      if (!repuesto) throw new NotFoundError('Repuesto usado no encontrado');
      return repuesto;
    } catch (error) {
      logger.error('Error al obtener repuesto usado:', error);
      throw error;
    }
  }

  /**
   * Eliminar un repuesto usado por su ID
   * @param {number} id - ID del repuesto usado
   * @param {Object} [options] - Opciones de Sequelize (como transaction)
   * @returns {Promise<boolean>}
   */
  async deleteRepuesto(id, options = {}) {
    try {
      await RepuestoUsado.destroy({
        where: { id },
        force:true,
        ...options
      });

      return true;
    } catch (error) {
      logger.error('Error al eliminar repuesto usado:', error);
      throw error;
    }
  }
}
