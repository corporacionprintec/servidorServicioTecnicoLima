import { Router } from 'express';
import { updateDispositivo } from '../controllers/dispositivoControllerUp.js';

const router = Router();

// Endpoint para actualizar un dispositivo: PUT /api/dispositivos/:id
router.put('/dispositivos/:id', updateDispositivo);

export default router;
