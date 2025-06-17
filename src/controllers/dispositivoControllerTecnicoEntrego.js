import { Dispositivo } from '../models/index.js';
import logger from '../config/logger.js';

/**
 * @swagger
 * /dispositivos/{id}/tecnico-entrego:
 *   put:
 *     tags:
 *       - Dispositivos: Entrega
 *     summary: Actualiza el campo tecnico_entrego de un dispositivo
 *     description: >
 *       Este endpoint permite actualizar el campo tecnico_entrego de un dispositivo, indicando qué técnico realizó la entrega.
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
 *               tecnico_entrego:
 *                 type: integer
 *                 description: ID del técnico que entrega el dispositivo.
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
 *                   example: Campo tecnico_entrego actualizado correctamente
 *                 dispositivo:
 *                   $ref: '#/components/schemas/Dispositivo'
 *       400:
 *         description: Faltan datos requeridos o datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Faltan datos requeridos
 *       404:
 *         description: Dispositivo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dispositivo no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
export const updateTecnicoEntrego = async (req, res) => {
  try {
    const { id } = req.params;
    const { tecnico_entrego } = req.body;
    if (!tecnico_entrego) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      logger.warn(`[updateTecnicoEntrego] No se encontró dispositivo con id: ${id}`);
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    dispositivo.tecnico_entrego = tecnico_entrego;
    await dispositivo.save();
    logger.info(`[updateTecnicoEntrego] tecnico_entrego actualizado para dispositivo ${id}: ${tecnico_entrego}`);
    return res.status(200).json({
      message: 'Campo tecnico_entrego actualizado correctamente',
      dispositivo
    });
  } catch (error) {
    logger.error(`[updateTecnicoEntrego] Error: ${error.message}`);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
