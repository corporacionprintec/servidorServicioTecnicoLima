import express from 'express';
import tecnicoController from '../controllers/tecnicoControllerAdmin.js';

const router = express.Router();

router.get('/', tecnicoController.getAllTecnicos);
router.get('/:id', tecnicoController.getTecnicoById);
router.post('/', tecnicoController.createTecnico);
router.put('/:id', tecnicoController.updateTecnico);
router.delete('/:id', tecnicoController.deleteTecnico);

export default router;
