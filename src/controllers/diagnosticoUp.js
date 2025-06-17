/**
 * @swagger
 * /api/dispositivos/{id}/imagen-diagnostico:
 *   put:
 *     tags:
 *       - Dispositivos: Carga de Imagen y Actualización de Diagnóstico
 *     summary: Sube imagen de diagnóstico a Google Drive y actualiza datos del dispositivo
 *     description: >
 *       Actualiza el campo `imagenen_diagnostico` de un dispositivo, subiendo el archivo proporcionado a Google Drive y almacenando el enlace público.
 *       Permite actualizar los campos `diagnostico`, `costo_total` y `tecnico_id` en la misma operación.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               diagnostico:
 *                 type: string
 *                 description: Diagnóstico del dispositivo (opcional).
 *               costo_total:
 *                 type: number
 *                 format: float
 *                 description: Costo total de la reparación (opcional).
 *               tecnico_id:
 *                 type: integer
 *                 description: ID del técnico que realiza el diagnóstico (opcional).
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de diagnóstico (opcional).
 *               fecha_diagnostico:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora en que se realizó el diagnóstico (opcional).
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dispositivo actualizado exitosamente.
 *                 dispositivo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     imagenen_diagnostico:
 *                       type: string
 *                     diagnostico:
 *                       type: string
 *                     costo_total:
 *                       type: number
 *                     tecnico_id:
 *                       type: integer
 *       400:
 *         description: El ID del dispositivo es obligatorio.
 *       404:
 *         description: Dispositivo no encontrado.
 *       500:
 *         description: Error interno al actualizar el dispositivo.
 */



import { google } from 'googleapis';
import stream from 'stream';
import dotenv from 'dotenv';
import models, { sequelize } from '../models/index.js';
import { uploadToDrive } from '../utils/driveHandler.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import path from 'path';
import logger from '../config/logger.js';
const { Dispositivo } = models;

export const updateImagenDiagnostico = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger.warn('[updateImagenDiagnostico] ID de dispositivo no proporcionado');
      return res.status(400).json({ error: 'El ID del dispositivo es obligatorio.' });
    }

    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      logger.warn(`[updateImagenDiagnostico] Dispositivo no encontrado: ${id}`);
      return res.status(404).json({ error: 'Dispositivo no encontrado.' });
    }

    if (req.file) {
      const folderId = process.env.GOOGLE_DRIVE_AUDIOS_FOLDER_ID;
      const fileName = `diagnostico_${req.file.filename}`;
      const result = await uploadToDrive(req.file, fileName, folderId);
      dispositivo.imagenen_diagnostico = result.webViewLink;
      logger.info(`[updateImagenDiagnostico] Imagen de diagnóstico subida para dispositivo ${id}: ${result.webViewLink}`);
    }

    if (req.body.diagnostico) {
      dispositivo.diagnostico = req.body.diagnostico;
    }
    if (req.body.costo_total) {
      dispositivo.costo_total = parseFloat(req.body.costo_total);
    }
    if (req.body.tecnico_id) {
      dispositivo.tecnico_id = req.body.tecnico_id;
      logger.info(`[updateImagenDiagnostico] tecnico_id recibido y asignado: ${req.body.tecnico_id}`);
    } else {
      logger.info(`[updateImagenDiagnostico] tecnico_id NO recibido en el body`);
    }
    if (req.body.fecha_diagnostico) {
      // Guardar la fecha/hora exactamente como la selecciona el usuario, sin conversión ni interpretación de zona horaria
      let fecha = req.body.fecha_diagnostico;
      // Si viene en formato 'YYYY-MM-DDTHH:mm', convertir a 'YYYY-MM-DD HH:mm:00'
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fecha)) {
        fecha = fecha.replace('T', ' ') + ':00';
      }
      // Si viene en formato 'YYYY-MM-DD HH:mm', agregar ':00'
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(fecha)) {
        fecha = fecha + ':00';
      }
      // Guardar como string plano en la base de datos (sin conversión de zona horaria)
      await sequelize.query(
        'UPDATE dispositivos SET fecha_diagnostico = :fecha WHERE id = :id',
        { replacements: { fecha, id }, type: sequelize.QueryTypes.UPDATE }
      );
      dispositivo.fecha_diagnostico = fecha;
      logger.info(`[updateImagenDiagnostico] fecha_diagnostico guardada EXACTAMENTE como la seleccionó el usuario: ${fecha}`);
    } else {
      logger.info(`[updateImagenDiagnostico] fecha_diagnostico NO recibida en el body`);
    }

    await dispositivo.save();
    logger.info(`[updateImagenDiagnostico] Dispositivo ${id} guardado. tecnico_id actual: ${dispositivo.tecnico_id}, fecha_diagnostico: ${dispositivo.fecha_diagnostico}`);

    return res.status(200).json({
      message: 'Dispositivo actualizado exitosamente.',
      dispositivo,
    });
  } catch (error) {
    logger.error(`[updateImagenDiagnostico] Error al actualizar dispositivo: ${error.message}`, { error });
    return res.status(500).json({ error: 'Error al actualizar dispositivo.' });
  }
};