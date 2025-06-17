//importacion de sercvicios
import { OrdenServicioService } from '../services/ordenServicioService.js';
import { RepuestoService } from '../services/repuestoService.js';
//importacion de utilidades
import { responseHandler } from '../utils/responseHandler.js';
import logger from '../config/logger.js';
import { sequelize } from '../models/index.js';
import { ValidationError } from '../utils/errors.js';

const ordenServicioService = new OrdenServicioService();
const repuestoService = new RepuestoService();

/**
 * @swagger
 * /repuestos:
 *   post:
 *     tags:
 *       - Repuestos
 *     summary: Crear un nuevo repuesto
 *     description: Crea un nuevo repuesto consumido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orden_id
 *               - repuesto_nombre
 *               - cantidad
 *             properties:
 *               orden_id:
 *                 type: number
 *                 description: ID de la orden
 *               repuesto_nombre:
 *                 type: string
 *                 description: Nombre del repuesto
 *               cantidad:
 *                 type: number
 *                 description: Cantidad del repuesto
 *     responses:
 *       201:
 *         description: Repuesto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicioDetail'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente o dispositivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const createRepuesto = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const data = req.body;
      // verificar existencia de orden de servicio
      const orden = await ordenServicioService.getOrdenById(data.orden_id);
      if (!orden) {
        throw new ValidationError('Orden de servicio no encontrada');
      }
      //crear repuesto
      await repuestoService.createRepuesto(data, { transaction: t });
      //enviar orden actualizada
      const ordenActualizada = await ordenServicioService.getOrdenById(data.orden_id, { transaction: t });
      await t.commit();
      responseHandler.created(res, ordenActualizada, 'Repuesto creado exitosamente');
    } catch (error) {
      logger.error('Error al crear orden de servicio:', error);
      await t.rollback();
      next(error);
    }
  };

/**
 * @swagger
 * /repuestos/{id}:
 *   delete:
 *     tags:
 *       - Repuestos
 *     summary: Eliminar un repuesto usado
 *     description: Elimina un repuesto usado del sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del repuesto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Repuesto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicioDetail'
 *       404:
 *         description: Repuesto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export const deleteRepuesto = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const repuesto = await repuestoService.getRepuestoById(req.params.id, { transaction: t });
    if (!repuesto) {
      throw new ValidationError('Repuesto no encontrado');
    }
    await repuestoService.deleteRepuesto(repuesto.id, { transaction: t });
    const orden = await ordenServicioService.getOrdenById(repuesto.orden_id, { transaction: t });
    await t.commit();
    responseHandler.deleted(res, orden, 'Repuesto eliminado exitosamente');
    
  } catch (error) {
    logger.error('Error al eliminar repuesto:', error);
    await t.rollback();
    next(error);
  }
};