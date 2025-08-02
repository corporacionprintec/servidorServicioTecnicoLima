import { CierreCaja, Pago, Tecnico } from '../models/index.js';

export const createCierreCaja = async (req, res) => {
  try {
    console.log('Body recibido en createCierreCaja:', req.body);
    const { tecnico_id, monto_cierre, observaciones, fecha_cierre } = req.body;
    // Log de los valores individuales
    console.log('tecnico_id:', tecnico_id, 'monto_cierre:', monto_cierre);
    // Validación explícita
    if (!tecnico_id || isNaN(Number(tecnico_id))) {
      return res.status(400).json({ status: 'error', message: 'tecnico_id es requerido y debe ser numérico' });
    }
    if (!monto_cierre || isNaN(Number(monto_cierre))) {
      return res.status(400).json({ status: 'error', message: 'monto_cierre es requerido y debe ser numérico' });
    }

    // Crear el cierre de caja
    const cierre = await CierreCaja.create({
      tecnico_id: Number(tecnico_id),
      monto_total: Number(monto_cierre),
      observaciones: observaciones || '',
      fecha_cierre: fecha_cierre || new Date()
    });

    // Actualizar todos los pagos pendientes (no cuadrados)
    await Pago.update(
      { cierre_caja_id: cierre.id },
      { where: { cierre_caja_id: null } }
    );

    // Obtener el cierre con sus pagos asociados
    const cierreConPagos = await CierreCaja.findByPk(cierre.id, {
      include: [{ model: Pago, as: 'pagos' }]
    });

    res.status(201).json({ 
      status: 'success', 
      cierre: cierreConPagos 
    });
  } catch (error) {
    console.error('Error en createCierreCaja:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllCierresCaja = async (req, res) => {
  try {
    console.log('Entrando a getAllCierresCaja');
    const cierres = await CierreCaja.findAll({
      include: [
        { model: Pago, as: 'pagos' },
        { model: Tecnico, as: 'tecnico' } // Cambiado de 'usuario' a 'tecnico'
      ],
      order: [['fecha_cierre', 'DESC']]
    });
    console.log('Cierres encontrados:', cierres.length);
    res.json({ status: 'success', data: cierres });
  } catch (error) {
    console.error('Error en getAllCierresCaja:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getCierreCajaById = async (req, res) => {
  try {
    const cierre = await CierreCaja.findByPk(req.params.id, {
      include: [
        { model: Pago, as: 'pagos' },
        { model: Tecnico, as: 'usuario' }
      ]
    });
    if (!cierre) return res.status(404).json({ status: 'error', message: 'No encontrado' });
    res.json({ status: 'success', data: cierre });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const asociarPagosACierre = async (req, res) => {
  try {
    const { pagoIds } = req.body; // array de IDs de pagos
    const cierreId = req.params.id;
    await Pago.update({ cierre_caja_id: cierreId }, { where: { id: pagoIds } });
    res.json({ status: 'success', message: 'Pagos asociados correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};