import { Dispositivo } from '../models/index.js';
import dispositivoScanService from '../services/dispositivoScanService.js';
import { responseHandler } from '../utils/responseHandler.js';
import logger from '../config/logger.js';

export const updateQrScan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qr_scan, tecnico_recibio } = req.body;

    // Log de entrada
    logger.info(`[updateQrScan] Recibido para dispositivo ${id}: qr_scan=${qr_scan}, tecnico_recibio=${tecnico_recibio}`);

    const dispositivo = await dispositivoScanService.updateQrScanAndDetails(id, {
      qr_scan,
      tecnico_recibio
    });

    logger.info(`[updateQrScan] Dispositivo ${id} actualizado correctamente. tecnico_recibio=${tecnico_recibio}`);
    return responseHandler.success(res, dispositivo, 'Dispositivo actualizado exitosamente');
  } catch (error) {
    // Log de error
    logger.error(`[updateQrScan] Error al actualizar dispositivo: ${error.message}`);
    next(error);
  }
};


/**
 * @swagger
 * /dispositivoscanup/{id}:
 *   put:
 *     tags:
 *       - Dispositivos: Actualización de QR y Detalles
 *     summary: Actualiza el QR y el técnico que recibe un dispositivo
 *     description: >
 *       Este endpoint permite actualizar los campos `qr_scan` y `tecnico_recibio` de un dispositivo.
 *       Ambos campos son opcionales, pero al menos uno debe estar presente en el body.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qr_scan:
 *                 type: string
 *                 description: Nuevo valor para el campo QR Scan.
 *               tecnico_recibio:
 *                 type: integer
 *                 description: ID del técnico que recibió el dispositivo.
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dispositivo actualizado exitosamente
 *                 dispositivo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     qr_scan:
 *                       type: string
 *                     tecnico_recibio:
 *                       type: integer
 *       404:
 *         description: Dispositivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Dispositivo no encontrado
 *       500:
 *         description: Error al actualizar el dispositivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar el dispositivo
 *                 details:
 *                   type: string
 *                   example: Detalle del error específico
 */
