import { ClienteService } from '../services/clienteService.js';
import { responseHandler } from '../utils/responseHandler.js';

const clienteService = new ClienteService();

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear un nuevo cliente
 *     description: Crea un nuevo cliente en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente
 *               email:
 *                 type: string
 *                 description: Email del cliente
 *               telefono:
 *                 type: string
 *                 description: Teléfono del cliente
 *               direccion:
 *                 type: string
 *                 description: Dirección del cliente
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const createCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    responseHandler.created(res, cliente, 'Cliente creado exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener un cliente por ID
 *     description: Retorna los datos de un cliente específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.getClienteById(req.params.id);
    responseHandler.success(res, cliente, 'Cliente encontrado');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/clientes/search:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Buscar clientes
 *     description: Busca clientes con filtros y paginación
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: telefono
 *         schema:
 *           type: string
 *         description: Filtrar por teléfono
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
export const searchClientes = async (req, res, next) => {
  try {
    const { page, limit, ...filters } = req.query;
    const result = await clienteService.searchClientes(
      filters,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );
    responseHandler.success(res, result, 'Clientes encontrados');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * /clientes/{id}:
 *   put:
 *     tags:
 *       - Clientes
 *     summary: Actualizar un cliente
 *     description: Actualiza los datos de un cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const updateCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.updateCliente(req.params.id, req.body);
    responseHandler.updated(res, cliente, 'Cliente actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * /clientes/{id}:
 *   delete:
 *     tags:
 *       - Clientes
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente del sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteCliente = async (req, res, next) => {
  try {
    await clienteService.deleteCliente(req.params.id);
    responseHandler.deleted(res, 'Cliente eliminado exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * /clientes/{id}/historial:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener historial de servicios
 *     description: Obtiene el historial de órdenes de servicio de un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de servicios encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrdenServicio'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getHistorialServicio = async (req, res, next) => {
  try {
    const historial = await clienteService.getHistorialServicio(req.params.id);
    responseHandler.success(res, historial, 'Historial de servicios encontrado');
  } catch (error) {
    next(error);
  }
};
