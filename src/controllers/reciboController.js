/**
 * @swagger
 * /api/dispositivos/{id}/recibo:
 *   put:
 *     tags:
 *       - Dispositivos: Carga de Recibo PDF
 *     summary: Sube un recibo en PDF a Google Drive y actualiza datos del dispositivo
 *     description: >
 *       Este endpoint actualiza el campo `recibo` de un dispositivo, subiendo el archivo PDF
 *       proporcionado a Google Drive y almacenando el enlace público.
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
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo PDF que se subirá a Google Drive como recibo del dispositivo.
 *     responses:
 *       200:
 *         description: Recibo actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recibo actualizado exitosamente.
 *                 dispositivo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     recibo:
 *                       type: string
 *       400:
 *         description: El ID del dispositivo es obligatorio.
 *       404:
 *         description: Dispositivo no encontrado.
 *       500:
 *         description: Error interno al actualizar el recibo.
 */

import models from '../models/index.js';
import { uploadToDrive } from '../utils/driveHandler.js';
const { Dispositivo } = models;

export const updateRecibo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'El ID del dispositivo es obligatorio.' });
    }

    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      return res.status(404).json({ error: 'Dispositivo no encontrado.' });
    }

    if (req.file) {
      const folderId = process.env.GOOGLE_DRIVE_AUDIOS_FOLDER_ID;
      const fileName = `recibo_${req.file.filename}`;
      const result = await uploadToDrive(req.file, fileName, folderId);
      dispositivo.recibo = result.webViewLink;
    } else {
      return res.status(400).json({ error: 'No se ha proporcionado un archivo para el recibo.' });
    }

    await dispositivo.save();

    return res.status(200).json({
      message: 'Recibo actualizado exitosamente.',
      dispositivo: {
        id: dispositivo.id,
        recibo: dispositivo.recibo
      }
    });
  } catch (error) {
    console.error('Error al actualizar recibo:', error);
    return res.status(500).json({ error: 'Error al actualizar recibo.' });
  }
}; 