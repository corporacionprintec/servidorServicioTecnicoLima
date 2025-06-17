import express from 'express';
import * as cierreCajaController from '../controllers/cierreCajaController.js';

const router = express.Router();

// Crear un cierre de caja
router.post('/', cierreCajaController.createCierreCaja);
// Obtener todos los cierres de caja
router.get('/', cierreCajaController.getAllCierresCaja);
// Obtener un cierre de caja por ID
router.get('/:id', cierreCajaController.getCierreCajaById);
// Asociar pagos a un cierre de caja
router.post('/:id/asociar-pagos', cierreCajaController.asociarPagosACierre);

export default router;
