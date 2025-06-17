import { Router } from 'express';
import {
  createRepuesto,
  deleteRepuesto
} from '../controllers/repuestoControllers.js';

const router = Router();

// Rutas para clientes
router.post('/', createRepuesto);
router.delete('/:id', deleteRepuesto);

export default router;