import models from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

const { OrdenServicio } = models;

/**
 * @class OrdenServicioEstadoService
 * @description Servicio para consultar estados de órdenes de servicio
 */
export class OrdenServicioEstadoService {
  /**
   * Busca una orden de servicio por su número de ticket
   * @param {string} ticket - Número de ticket de la orden
   * @returns {Promise<Object>} Datos básicos de la orden de servicio
   * @throws {NotFoundError} Si no se encuentra la orden
   */
  async getOrdenServicioByTicket(ticket) {
    logger.info(`Buscando orden de servicio con ticket: ${ticket}`);
    
    const orden = await OrdenServicio.findOne({
      where: { ticket },
      attributes: [
        'estado',
        'problema_descrito',
        'ticket',
        'fecha_ingreso',
        'tipoServicio',
        'direccion',
        'fechaHoraServicio'
      ]
    });

    if (!orden) {
      logger.warn(`No se encontró orden de servicio con ticket: ${ticket}`);
      throw new NotFoundError('Orden de servicio no encontrada');
    }

    logger.info(`Orden de servicio encontrada: ${ticket}`);
    return orden;
  }
}

export default new OrdenServicioEstadoService();