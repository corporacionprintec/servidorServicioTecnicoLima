import { Router } from 'express';
import { createOrden, getListOrdenes, getOrden, updateStatusOrden, deleteOrden, updateTipoServicio, updateTipoOrden } from '../controllers/ordenServicioController.js';

const router = Router();

// Rutas para órdenes de servicio
router.post('/', createOrden);
router.get('/', getListOrdenes);
router.get('/:id', getOrden);
router.patch('/:id', updateStatusOrden);
router.delete('/:id', deleteOrden);
router.put('/:id/tipo-servicio', updateTipoServicio);
router.put('/:id/tipo-orden', updateTipoOrden); // Nueva ruta para actualizar tipo_orden
//router.get('/ticket/:ticket', getOrdenByTicket);

export default router;
