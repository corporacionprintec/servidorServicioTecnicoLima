import { Op } from 'sequelize';
import { Dispositivo, RepuestoUsado } from '../models/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import logger from '../config/logger.js';

export class DataService {
  async getDeviceAndPartsData(id) {
    try {
      const dispositivo = await Dispositivo.findOne({
        where: { id },
        include: [
          { association: 'cliente' },
          { association: 'ordenes' }
        ]
      });

      if (!dispositivo) {
        throw new NotFoundError('Dispositivo no encontrado');
      }

      const ordenIds = dispositivo.ordenes.map(orden => orden.id);
      const repuestos = await RepuestoUsado.findAll({
        where: {
          orden_id: {
            [Op.in]: ordenIds
          }
        }
      });

      return { dispositivo, repuestos };
    } catch (error) {
      logger.error('Error en getDeviceAndPartsData:', error);
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error al obtener datos del dispositivo y repuestos');
    }
  }
}

export default new DataService();