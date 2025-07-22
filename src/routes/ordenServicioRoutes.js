import { Router } from 'express';
import { createOrden, getListOrdenes, getOrden, updateStatusOrden, deleteOrden, updateTipoServicio } from '../controllers/ordenServicioController.js';

const router = Router();

// Rutas para órdenes de servicio
router.post('/', createOrden);
router.get('/', getListOrdenes);
router.get('/:id', getOrden);
router.patch('/:id', updateStatusOrden);
router.delete('/:id', deleteOrden);
router.put('/:id/tipo-servicio', updateTipoServicio);
//router.get('/ticket/:ticket', getOrdenByTicket);

export default router;
