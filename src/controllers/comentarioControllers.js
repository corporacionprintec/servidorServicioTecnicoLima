//importacion de sercvicios
import { OrdenServicioService } from '../services/ordenServicioService.js';
import { ComentarioService } from '../services/comentarioService.js';
//importacion de midlewares
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import sequelize from '../models/index.js';
import { responseHandler } from '../utils/responseHandler.js';
import { uploadToDrive } from '../utils/driveHandler.js';
import logger from '../config/logger.js';

// Instanciar servicios
const ordenServicioService = new OrdenServicioService();
const comentarioService = new ComentarioService();

/**
 * @swagger
 * /comentarios:
 *   post:
 *     tags:
 *       - Comentarios
 *     summary: Crear un nuevo comentario
 *     description: Crea un nuevo comentario para una orden de servicio
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - orden_id
 *               - autor
 *             properties:
 *               orden_id:
 *                 type: number
 *                 description: ID de la orden de servicio
 *               autor:
 *                 type: string
 *                 description: Nombre del autor del comentario
 *               contenido:
 *                 type: string
 *                 description: Contenido del comentario si es tipo texto
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de audio con la descripción del problema
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
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
export const createComentario = [
  uploadMiddleware.audio.single('audio'),
  async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
			console.log("paso 1");
			
      const data = req.body;
      // verficar si existe orden
      const orden = await ordenServicioService.getOrdenById(data.orden_id, { transaction: t });
      if (!orden) {
        return responseHandler.notFound(res, 'Orden de servicio no encontrada');
      };
			console.log("paso 2");
			console.log(req.file);
			
			
      // Si hay un archivo de audio, agregar la URL
      if (req.file) {
        const filename = `audio-orden-${data.orden_id}-autor-${data.autor}-${Date.now()}`
        const carpetaDeAudio = process.env.GOOGLE_DRIVE_AUDIOS_FOLDER_ID;
        const { webViewLink, id } = await uploadToDrive(req.file, filename, carpetaDeAudio, t);
        data.url_audio = webViewLink;
        data.audio_id = id;
        const comentario1 = await comentarioService.createComentario({
            orden_id: data.orden_id,
            autor: data.autor,
            tipo: "audio",
            url_audio: data.url_audio,
            audio_id: data.audio_id
          }, { transaction: t });
				console.log(comentario1);
				console.log("paso 3");
      }

			
      // Crear Comentario

      if (data.contenido) {
        const comentario2 = await comentarioService.createComentario({
        orden_id: data.orden_id,
        autor: data.autor,
        tipo: "texto",
        contenido: data.contenido
      	}, { transaction: t });
				console.log(comentario2);
				console.log("paso 4");
      }
			
			
      const ordenActualizada = await ordenServicioService.getOrdenById(data.orden_id, { transaction: t });
			console.log("paso 5");
			
      await t.commit();
      responseHandler.created(res, ordenActualizada, 'Comentario creado exitosamente');
    } catch (error) {
      logger.error('Error al crear comentario:', error);
      await t.rollback();
      
      // Si hay error y se subió un archivo, eliminarlo
      if (req.file) {
        await deleteFileById(req.file.id, t);
      }
      
      next(error);
    }
  }
];

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags:
 *       - Comentarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicioDetail'
 *       404:
 *         description: Comentario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteComentario = async (req, res, next) => {
	const t = await sequelize.transaction();
	try {
		const comentario = await comentarioService.getComentarioById(req.params.id, { transaction: t });
		if (!comentario) {
			return responseHandler.notFound(res, 'Comentario no encontrado');
		}
		await comentarioService.deleteComentarioById(req.params.id, { transaction: t });
		const orden = await ordenServicioService.getOrdenById(comentario.orden_id, { transaction: t });
		//logger.info(JSON.stringify(orden, null, 2));
		await t.commit();
		responseHandler.deleted(res, orden, 'Comentario eliminado exitosamente');
	} catch (error) {
		logger.error('Error al eliminar comentario:', error);
		await t.rollback();
		next(error);
	}
};