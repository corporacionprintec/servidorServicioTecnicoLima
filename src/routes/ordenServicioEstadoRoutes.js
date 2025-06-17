// src/routes/ordenServicioRoutes.js
import express from 'express';
import { getOrdenServicioByTicket } from '../controllers/ordenServicioControllerEstado.js';

const router = express.Router();

// Definición de la ruta relativa:
// GET /ticket/:ticket
router.get('/ticket/:ticket', getOrdenServicioByTicket);

export default router;
