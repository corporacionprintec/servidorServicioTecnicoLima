/**
 * @swagger
 * /api/ordenes-servicioEstado/ticket/{ticket}:
 *   get:
 *     tags:
 *       - Orden de Servicio (RastreadorPedido.js)
 *     summary: Obtiene una orden de servicio por ticket
 *     description: >
 *       Este endpoint busca una orden de servicio utilizando el parámetro `ticket` y retorna detalles
 *       básicos de la orden, como estado, problema descrito, fecha de ingreso, tipo de servicio, dirección y fecha/hora del servicio.
 *     parameters:
 *       - in: path
 *         name: ticket
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket de la orden de servicio a buscar.
 *     responses:
 *       200:
 *         description: Orden de servicio encontrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 problema_descrito:
 *                   type: string
 *                 ticket:
 *                   type: string
 *                 fecha_ingreso:
 *                   type: string
 *                   format: date-time
 *                 tipoServicio:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 fechaHoraServicio:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Orden de servicio no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orden de servicio no encontrada
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

import ordenServicioEstadoService from '../services/ordenServicioEstadoService.js';

export const getOrdenServicioByTicket = async (req, res) => {
  const { ticket } = req.params;
  
  try {
    const orden = await ordenServicioEstadoService.getOrdenServicioByTicket(ticket);
    return res.json(orden);
  } catch (error) {
    console.error('Error al buscar la orden de servicio:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
