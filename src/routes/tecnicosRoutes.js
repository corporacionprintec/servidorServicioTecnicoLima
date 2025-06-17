import express from 'express';
import { loginTecnico, registrarTecnico } from '../controllers/tecnicosController.js';

const router = express.Router();

router.post('/login', loginTecnico);
router.post('/registrar', registrarTecnico);

export default router;
