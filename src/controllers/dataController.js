import dataService from '../services/dataService.js';
import { responseHandler } from '../utils/responseHandler.js';

/**
 * @swagger
 * /api/data/{id}:
 *   get:
 *     tags:
 *       - "Dispositivo y Repuesto"
 *     summary: Obtener datos dispositivo y repuesto
 *     description: Recupera la información de un dispositivo, incluyendo el cliente asociado, sus órdenes y los repuestos usados en esas órdenes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del dispositivo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dispositivo:
 *                   type: object
 *                   description: Información del dispositivo, junto con el cliente y órdenes asociadas.
 *                 repuestos:
 *                   type: array
 *                   description: Lista de repuestos usados asociados a las órdenes del dispositivo.
 *                   items:
 *                     type: object
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
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error en el servidor
 */


export const getDataById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await dataService.getDeviceAndPartsData(id);
    return responseHandler.success(res, data);
  } catch (error) {
    next(error);
  }
};
