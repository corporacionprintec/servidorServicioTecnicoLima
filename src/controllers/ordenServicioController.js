//importacion de librerias
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//importacion de servicios
import { OrdenServicioService } from '../services/ordenServicioService.js';
import { ClienteService } from '../services/clienteService.js';
import { DispositivoService } from '../services/dispositivoService.js';
//importacion de midlewares
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
//importacion de utilidades
import { responseHandler } from '../utils/responseHandler.js';
import logger from '../config/logger.js';
import { sequelize } from '../models/index.js';
import { uploadToDrive } from '../utils/driveHandler.js';

const ordenServicioService = new OrdenServicioService();
const clienteService = new ClienteService();
const dispositivoService = new DispositivoService();

/**
 * @swagger
 * /ordenes:
 *   post:
 *     tags:
 *       - Ordenes
 *     summary: Crear una nueva orden de servicio
 *     description: Crea una nueva orden de servicio con opción de incluir un archivo de audio y los nuevos campos para servicio a domicilio.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - telefono
 *               - tipo_dispositivo
 *               - marca
 *               - modelo
 *               - descripcion_problema
 *               - tipoServicio
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente
 *               apellido:
 *                 type: string
 *                 description: Apellido del cliente
 *               telefono:
 *                 type: string
 *                 description: Teléfono del cliente
 *               tipo_dispositivo:
 *                 type: string
 *                 description: Tipo de dispositivo
 *               otro_dispositivo:
 *                 type: string
 *                 description: Otro tipo de dispositivo
 *               marca:
 *                 type: string
 *                 description: Marca del dispositivo
 *               modelo:
 *                 type: string
 *                 description: Modelo del dispositivo
 *               descripcion_problema:
 *                 type: string
 *                 description: Descripción del problema
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de audio con la descripción del problema
 *               qr_scan:
 *                 type: string
 *                 description: URL del código QR
 *               tipoServicio:
 *                 type: string
 *                 description: Tipo de servicio ("enTaller" o "domicilio")
 *               direccion:
 *                 type: string
 *                 description: Dirección o ubicación (opcional; se envía si tipoServicio es "domicilio")
 *               fechaHoraServicio:
 *                 type: string
 *                 description: Fecha y hora del servicio; puede ser en formato ISO o un texto manual (por ejemplo, "Martes 23 a las 5 pm")
 *               tipo_orden:
 *                 type: string
 *                 enum: [reparacion, venta]
 *                 description: Tipo de orden (reparacion o venta)
 *     responses:
 *       201:
 *         description: Orden de servicio creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicio'
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
export const createOrden = [
  
  uploadMiddleware.audio.single('audio'),
  
  async (req, res, next) => {
    console.log('Datos recibidos:', req.body);
    const t = await sequelize.transaction();
    try {
      // Se extraen los nuevos campos junto a los ya existentes
      let { 
        nombre, 
        apellido, 
        telefono, 
        tipo_dispositivo, 
        otro_dispositivo, 
        marca, 
        modelo, 
        descripcion_problema, 
        qr_scan,
        tipoServicio,    // nuevo campo
        direccion,       // nuevo campo (para servicio a domicilio)
        fechaHoraServicio, // nuevo campo (para servicio a domicilio)
        tipo_orden,      // nuevo campo (tipo de orden)
        ...data 
      } = req.body;

      // Validar tipoServicio
      if (!tipoServicio || tipoServicio === 'undefined') {
        tipoServicio = null;
      }

      // Buscar cliente por número de teléfono
      let cliente = await clienteService.getClienteByTelefono(telefono);
      if (!cliente) {
        // Si no existe, crear cliente
        cliente = await clienteService.createCliente({
          nombre,
          apellido,
          telefono, 
        }, { transaction: t });
      }

      // Crear dispositivo, incluyendo el campo "qr_scan"
      const dispositivo = await dispositivoService.createDispositivo({
        cliente_id: cliente.id,
        tipo_dispositivo: tipo_dispositivo === 'Otro' ? otro_dispositivo : tipo_dispositivo,
        modelo,
        marca,
        qr_scan // Almacena la URL del código QR
      }, { transaction: t });
      
      // Si hay un archivo de audio, agregar la URL y el id correspondiente
      if (req.file) {
        const filename = `audio-nombre-${Date.now()}`;
        const carpetaDeAudio = process.env.GOOGLE_DRIVE_AUDIOS_FOLDER_ID;
        const { webViewLink, id } = await uploadToDrive(req.file, filename, carpetaDeAudio, t);
        data.audio = webViewLink;
        data.audio_id = id;
      }

      // Procesar las fotos: subir cada foto a Drive y almacenar su enlace permanente
      if (req.files && req.files.fotos && req.files.fotos.length > 0) {
        const fotosURLs = [];
        for (let i = 0; i < req.files.fotos.length; i++) {
          const foto = req.files.fotos[i];
          const filename = `foto-nombre-${Date.now()}-${i}`;
          const carpetaDeFotos = process.env.GOOGLE_DRIVE_FOTOS_FOLDER_ID;
          const { webViewLink } = await uploadToDrive(foto, filename, carpetaDeFotos, t);
          fotosURLs.push(webViewLink);
        }
        data.fotos = fotosURLs;
      }
      
      // Crear orden de servicio, incluyendo los nuevos campos en caso de que se hayan enviado
      const orden = await ordenServicioService.createOrden({
        cliente_id: cliente.id,
        dispositivo_id: dispositivo.id,
        problema_descrito: descripcion_problema,
        tipoServicio,        // Ahora puede ser null
        direccion,           
        fechaHoraServicio,   
        tipo_orden: tipo_orden || null, // Ahora permite nulo
        ...data
      }, { transaction: t });

      await t.commit();
      responseHandler.created(res, orden, 'Orden de servicio creada exitosamente');
    } catch (error) {
      logger.error('Error al crear orden de servicio:', error);
      await t.rollback();
      
      // Si hay error y se subió un archivo, eliminarlo
      if (req.file) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'audio', req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) logger.error('Error al eliminar archivo de audio:', err);
        });
      }
      
      next(error);
    }
  }
];

/**
 * @swagger
 * /ordenes/{id}:
 *   get:
 *     tags:
 *       - Ordenes
 *     summary: Obtener una orden por ID
 *     description: Retorna una orden de servicio específica por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicioDetail'
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getOrden = async (req, res, next) => {
  try {
    const orden = await ordenServicioService.getOrdenById(req.params.id);
    return responseHandler.success(res, orden);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /ordenes:
 *   get:
 *     tags:
 *       - Ordenes
 *     summary: Obtener lista de órdenes de servicio
 *     description: Retorna una lista paginada de órdenes de servicio con sus relaciones (dispositivo, cliente, técnico)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, entregado, cancelado]
 *         description: Filtrar por estado de la orden
 *       - in: query
 *         name: prioridad
 *         schema:
 *           type: string
 *           enum: [baja, normal, alta, urgente]
 *         description: Filtrar por prioridad de la orden
 *       - in: query
 *         name: tecnico_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del técnico asignado
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del cliente
 *     responses:
 *       200:
 *         description: Lista de órdenes recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicioList'
 *       400:
 *         description: Error en los parámetros de la solicitud
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
export const getListOrdenes = async (req, res, next) => {
  try {
    const { 
      page, 
      limit, 
      estado, 
      prioridad, 
      tecnico_id, 
      cliente_id 
    } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      estado,
      prioridad,
      tecnico_id: tecnico_id ? parseInt(tecnico_id) : undefined,
      cliente_id: cliente_id ? parseInt(cliente_id) : undefined
    };
    const ordenes = await ordenServicioService.listOrdenes(options);
    return responseHandler.success(res, ordenes);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /ordenes/{id}:
 *   patch:
 *     tags:
 *       - Ordenes
 *     summary: Actualizar estado de una orden
 *     description: Actualiza el estado de una orden de servicio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *       - in: query
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, entregado, cancelado]
 *         description: Nuevo estado de la orden
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicioDetail'
 *       400:
 *         description: Error en los parámetros de la solicitud
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
export const updateStatusOrden = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    const { estado } = req.query;
    const orden = await ordenServicioService.updateStatus(id, estado, { transaction: t });
    await t.commit();
    return responseHandler.success(res, orden);
  } catch (error) {
    if (t) await t.rollback();
    next(error);
  }
};

/**
 * @swagger
 * /ordenes/ticket/{ticket}:
 *   get:
 *     tags:
 *       - Ordenes
 *     summary: Obtener una orden por número de ticket
 *     description: Retorna una orden de servicio específica por su número de ticket
 *     parameters:
 *       - in: path
 *         name: ticket
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de ticket de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Orden encontrada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/OrdenServicio'
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getOrdenByTicket = async (req, res, next) => {
  try {
    const orden = await ordenServicioService.getOrdenByTicket(req.params.ticket);
    return responseHandler.success(res, orden);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /ordenes/{id}:
 *   delete:
 *     tags:
 *       - Ordenes
 *     summary: Eliminar una orden
 *     description: Elimina una orden de servicio específica por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Orden no encontrada
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
export const deleteOrden = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    // Obtener la orden por ID
    const orden = await ordenServicioService.getOrdenById(id);
    if (!orden) {
      return responseHandler.notFound(res, null, 'Orden no encontrada');
    }
    // Actualizar el campo costo_acordado (ahora booleano) para marcarla como "oculta"
    await orden.update({ costo_acordado: true }, { transaction: t });
    await t.commit();
    return responseHandler.success(res, orden, 'Orden ocultada exitosamente');
  } catch (error) {
    if (t) await t.rollback();
    next(error);
  }
};

/**
 * @swagger
 * /ordenes/{id}/tipo-servicio:
 *   put:
 *     tags:
 *       - Ordenes
 *     summary: Actualizar tipo de servicio de una orden
 *     description: Actualiza únicamente el tipo de servicio de una orden
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoServicio
 *             properties:
 *               tipoServicio:
 *                 type: string
 *                 description: Tipo de servicio (puede ser cualquier texto)
 *     responses:
 *       200:
 *         description: Tipo de servicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicio'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Orden no encontrada
 */
export const updateTipoServicio = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    const { tipoServicio } = req.body;

    const orden = await ordenServicioService.getOrdenById(id);
    
    if (!orden) {
      return responseHandler.notFound(res, null, 'Orden no encontrada');
    }

    // Update tipoServicio without validation
    await orden.update({ tipoServicio }, { transaction: t });

    await t.commit();
    return responseHandler.success(res, orden, 'Tipo de servicio actualizado exitosamente');
  } catch (error) {
    if (t) await t.rollback();
    next(error);
  }
};

/**
 * @swagger
 * /ordenes/{id}/tipo-orden:
 *   put:
 *     tags:
 *       - Ordenes
 *     summary: Actualizar tipo de orden (venta o reparación)
 *     description: Actualiza únicamente el campo tipo_orden de una orden
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_orden
 *             properties:
 *               tipo_orden:
 *                 type: string
 *                 enum: [reparacion, venta]
 *                 description: Tipo de orden (reparacion o venta)
 *     responses:
 *       200:
 *         description: Tipo de orden actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenServicio'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Orden no encontrada
 */