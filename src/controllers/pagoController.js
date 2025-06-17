import * as pagoService from '../services/pagoService.js';

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     tags:
 *       - Pagos
 *     summary: Obtiene todos los pagos
 *     description: Retorna una lista de todos los pagos registrados
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
export const getAllPagos = async (req, res) => {
  try {
    const pagos = await pagoService.findAllPagos();
    return res.status(200).json(pagos);
  } catch (error) {
    console.error('Error en getAllPagos:', error);
    return res.status(500).json({ error: error.message || 'Error al obtener pagos' });
  }
};

/**
 * @swagger
 * /api/pagos/{id}:
 *   get:
 *     tags:
 *       - Pagos
 *     summary: Obtiene un pago por ID de orden
 *     description: Retorna un pago según el ID de orden de servicio proporcionado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden de servicio
 *     responses:
 *       200:
 *         description: Pago obtenido exitosamente
 *       404:
 *         description: Pago no encontrado para esta orden
 *       500:
 *         description: Error del servidor
 */
export const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await pagoService.findPagoById(id);
    
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado para esta orden' });
    }
    
    return res.status(200).json(pago);
  } catch (error) {
    console.error('Error en getPagoById:', error);
    return res.status(500).json({ error: error.message || 'Error al obtener pago' });
  }
};

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     tags:
 *       - Pagos
 *     summary: Crea un nuevo pago
 *     description: Crea un nuevo registro de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: integer
 *               metodo_pago:
 *                 type: string
 *               monto:
 *                 type: number
 *               fecha_pago:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
export const createPago = async (req, res) => {
  try {
    const { orden_id, metodo_pago, monto, fecha_pago } = req.body;
    
    if (!orden_id || !metodo_pago || !monto) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
    const nuevoPago = await pagoService.createPago({
      orden_id,
      metodo_pago,
      monto,
      fecha_pago: fecha_pago || new Date()
    });
    
    return res.status(201).json(nuevoPago);
  } catch (error) {
    console.error('Error en createPago:', error);
    return res.status(500).json({ error: error.message || 'Error al crear pago' });
  }
};

/**
 * @swagger
 * /api/pagos/{id}:
 *   put:
 *     tags:
 *       - Pagos
 *     summary: Actualiza un pago existente
 *     description: Actualiza los datos de un pago según el ID proporcionado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: integer
 *               metodo_pago:
 *                 type: string
 *               monto:
 *                 type: number
 *               fecha_pago:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
export const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { orden_id, metodo_pago, monto, fecha_pago } = req.body;
    
    const pagoActualizado = await pagoService.updatePago(id, {
      ...(orden_id && { orden_id }),
      ...(metodo_pago && { metodo_pago }),
      ...(monto && { monto }),
      ...(fecha_pago && { fecha_pago })
    });
    
    return res.status(200).json(pagoActualizado);
  } catch (error) {
    console.error('Error en updatePago:', error);
    if (error.message === 'Pago no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || 'Error al actualizar pago' });
  }
};

/**
 * @swagger
 * /api/pagos/{id}:
 *   delete:
 *     tags:
 *       - Pagos
 *     summary: Elimina un pago
 *     description: Elimina un pago según el ID proporcionado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago eliminado exitosamente
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
export const deletePago = async (req, res) => {
  try {
    const { id } = req.params;
    await pagoService.deletePago(id);
    
    return res.status(200).json({ message: 'Pago eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deletePago:', error);
    if (error.message === 'Pago no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || 'Error al eliminar pago' });
  }
};

/**
 * @swagger
 * /api/pagos/orden/{ordenId}:
 *   get:
 *     tags:
 *       - Pagos
 *     summary: Obtiene pagos por orden de servicio
 *     description: Retorna todos los pagos asociados a una orden de servicio
 *     parameters:
 *       - in: path
 *         name: ordenId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden de servicio
 *     responses:
 *       200:
 *         description: Pagos obtenidos exitosamente
 *       500:
 *         description: Error del servidor
 */
export const getPagosByOrdenId = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const pagos = await pagoService.findPagosByOrdenId(ordenId);
    
    return res.status(200).json(pagos);
  } catch (error) {
    console.error('Error en getPagosByOrdenId:', error);
    return res.status(500).json({ error: error.message || 'Error al obtener pagos por orden' });
  }
};

/**
 * @swagger
 * /api/pagos/no-cuadrados:
 *   get:
 *     tags:
 *       - Pagos
 *     summary: Obtiene pagos no cuadrados (no asociados a ningún cierre de caja)
 *     description: Retorna todos los pagos cuyo campo cierre_caja_id es null
 *     responses:
 *       200:
 *         description: Pagos no cuadrados obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pago'
 *       500:
 *         description: Error del servidor
 */
export const getPagosNoCuadrados = async (req, res) => {
  try {
    const pagos = await pagoService.findPagosNoCuadrados();
    return res.status(200).json({ pagos });
  } catch (error) {
    console.error('Error en getPagosNoCuadrados:', error);
    return res.status(500).json({ error: error.message || 'Error al obtener pagos no cuadrados' });
  }
};