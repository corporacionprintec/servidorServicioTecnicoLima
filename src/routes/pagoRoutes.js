import express from 'express';
import * as pagoController from '../controllers/pagoController.js';

const router = express.Router();

// Rutas para pagos
router.get('/pagos/no-cuadrados', pagoController.getPagosNoCuadrados); // <-- primero
router.get('/pagos', pagoController.getAllPagos);
router.get('/pagos/:id', pagoController.getPagoById);
router.post('/pagos', pagoController.createPago);
router.put('/pagos/:id', pagoController.updatePago);
router.delete('/pagos/:id', pagoController.deletePago);
router.get('/pagos/orden/:ordenId', pagoController.getPagosByOrdenId);

export default router;