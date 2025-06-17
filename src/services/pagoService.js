import models from '../models/index.js';
const { Pago, OrdenServicio } = models;

export const findAllPagos = async (filters = {}) => {
  try {
    const pagos = await Pago.findAll({
      where: filters,
      include: [
        {
          model: OrdenServicio,
          as: 'orden'
        }
      ],
      order: [['fecha_pago', 'DESC']]
    });
    return pagos;
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    throw new Error('Error al obtener pagos');
  }
};

export const findPagoById = async (id) => {
  try {
    // Buscar directamente por orden_id
    const pago = await Pago.findOne({
      where: { orden_id: id },
      include: [
        {
          model: OrdenServicio,
          as: 'orden'
        }
      ]
    });
    
    return pago;
  } catch (error) {
    console.error(`Error al obtener pago con orden_id ${id}:`, error);
    throw new Error('Error al obtener pago');
  }
};

export const createPago = async (pagoData) => {
  try {
    const pago = await Pago.create(pagoData);
    return pago;
  } catch (error) {
    console.error('Error al crear pago:', error);
    throw new Error('Error al crear pago');
  }
};

export const updatePago = async (id, pagoData) => {
  try {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      throw new Error('Pago no encontrado');
    }
    
    await pago.update(pagoData);
    return pago;
  } catch (error) {
    console.error(`Error al actualizar pago con ID ${id}:`, error);
    throw new Error('Error al actualizar pago');
  }
};

export const deletePago = async (id) => {
  try {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      throw new Error('Pago no encontrado');
    }
    
    await pago.destroy();
    return true;
  } catch (error) {
    console.error(`Error al eliminar pago con ID ${id}:`, error);
    throw new Error('Error al eliminar pago');
  }
};

export const findPagosByOrdenId = async (ordenId) => {
  try {
    const pagos = await Pago.findAll({
      where: { orden_id: ordenId },
      order: [['fecha_pago', 'DESC']]
    });
    return pagos;
  } catch (error) {
    console.error(`Error al obtener pagos para la orden ${ordenId}:`, error);
    throw new Error('Error al obtener pagos por orden');
  }
};

/**
 * Busca todos los pagos que no están asociados a ningún cierre de caja (cierre_caja_id es null)
 * @returns {Promise<Array>} Lista de pagos no cuadrados
 */
export const findPagosNoCuadrados = async () => {
  try {
    const pagos = await Pago.findAll({
      where: { cierre_caja_id: null },
      order: [['fecha_pago', 'DESC']]
    });
    return pagos;
  } catch (error) {
    console.error('Error al obtener pagos no cuadrados:', error);
    throw new Error('Error al obtener pagos no cuadrados');
  }
};