import { Dispositivo } from '../models/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import logger from '../config/logger.js';

export class DispositivoScanService {
  async updateQrScanAndDetails(id, { qr_scan, tecnico_recibio }) {
    try {
      const dispositivo = await Dispositivo.findByPk(id);
      
      if (!dispositivo) {
        throw new NotFoundError('Dispositivo no encontrado');
      }

      if (tecnico_recibio !== undefined) {
        dispositivo.tecnico_recibio = tecnico_recibio;
        logger.debug(`Nuevo técnico que recibió (ID): ${tecnico_recibio}`);
      }

      logger.info(`Actualizando dispositivo ID: ${id}`);

      if (qr_scan !== undefined) {
        dispositivo.qr_scan = qr_scan;
        logger.debug(`Nuevo QR scan: ${qr_scan}`);
      }

      await dispositivo.save();
      logger.info(`Dispositivo ${id} actualizado exitosamente`);

      return dispositivo;
    } catch (error) {
      logger.error(`Error al actualizar dispositivo: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error al actualizar el dispositivo');
    }
  }
}

export default new DispositivoScanService();