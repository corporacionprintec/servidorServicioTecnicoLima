import { Router } from 'express';
import {
  createCliente,
  getCliente,
  searchClientes,
  updateCliente,
  deleteCliente,
  getHistorialServicio
} from '../controllers/clienteController.js';

const router = Router();

// Rutas para clientes
router.post('/', createCliente);
router.get('/search', searchClientes);
router.get('/:id', getCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);
router.get('/:id/historial', getHistorialServicio);

export default router;
