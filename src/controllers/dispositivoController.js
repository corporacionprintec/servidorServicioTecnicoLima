/**
 * @swagger
 * /dispositivos/validar-qr:
 *   get:
 *     tags:
 *       - Validación de QR y Consulta de Dispositivo
 *     summary: Valida el QR y obtiene datos del dispositivo asociado
 *     description: >
 *       Este endpoint recibe un parámetro "qr" en la query y lo valida. Se espera que el QR comience con
 *       "https://drive.google.com/drive/folders/". Si el formato es correcto, se buscan los dispositivos
 *       asociados a ese QR y se retorna la información correspondiente, incluyendo datos del dispositivo,
 *       cliente y órdenes de servicio.
 *     parameters:
 *       - in: query
 *         name: qr
 *         required: true
 *         schema:
 *           type: string
 *         description: Código QR a validar (debe iniciar con "https://drive.google.com/drive/folders/").
 *     responses:
 *       200:
 *         description: El QR es válido y se retornan los datos asociados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: El QR coincide
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       qr_scan:
 *                         type: string
 *                       modelo:
 *                         type: string
 *                       tipo_dispositivo:
 *                         type: string
 *                       diagnostico:
 *                         type: string
 *                       imagenen_diagnostico:
 *                         type: string
 *                       recibo:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       nombre:
 *                         type: string
 *                         nullable: true
 *                       apellido:
 *                         type: string
 *                         nullable: true
 *                       telefono:
 *                         type: string
 *                         nullable: true
 *                       problemas_descritos:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: El parámetro "qr" es obligatorio o el formato del QR es incorrecto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Se requiere el parámetro "qr"'
 *       404:
 *         description: No se encontró ningún dispositivo asociado al QR.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El QR no coincide
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



import models from '../models/index.js';
import { QrValidationService } from '../services/qrValidationService.js';
const qrValidationService = new QrValidationService();

export const validarQr = async (req, res) => {
  try {
    const { qr } = req.query;
    if (!qr) {
      return res.status(400).json({ message: 'Se requiere el parámetro "qr"' });
    }

    try {
      const responseData = await qrValidationService.validarQr(qr);
      return res.status(200).json({ 
        valid: true, 
        message: 'El QR coincide', 
        data: responseData 
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          valid: false, 
          message: error.message 
        });
      }
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ 
          valid: false, 
          message: 'El QR no coincide' 
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error en validarQr:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};