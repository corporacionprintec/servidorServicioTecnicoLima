// src/routes/dataRoutes.js
import { Router } from 'express';
import { getDataById } from '../controllers/dataController.js';

const router = Router();

// Endpoint para obtener los datos de un dispositivo y sus repuestos asociados por id
router.get('/:id', getDataById);

export default router;
