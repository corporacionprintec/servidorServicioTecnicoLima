import { Router } from 'express';
import {
    createComentario,
    deleteComentario
} from '../controllers/comentarioControllers.js';

const router = Router();

// Rutas para comentarios
router.post('/', createComentario);
router.delete('/:id', deleteComentario);

export default router;
