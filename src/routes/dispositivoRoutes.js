import { Router } from 'express';
import { validarQr } from '../controllers/dispositivoController.js';
import { updateTecnicoEntrego } from '../controllers/dispositivoControllerTecnicoEntrego.js';

const router = Router();

// Define el endpoint GET que recibe el parámetro "qr" por query string
// Ejemplo de uso: GET /api/dispositivos/validar-qr?qr=valorDelQr
router.get('/validar-qr', validarQr);

// Nuevo endpoint para actualizar tecnico_entrego
router.put('/:id/tecnico-entrego', updateTecnicoEntrego);

export default router;
