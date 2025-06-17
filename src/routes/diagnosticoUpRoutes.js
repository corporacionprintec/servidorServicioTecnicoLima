import express from 'express';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import { updateImagenDiagnostico } from '../controllers/diagnosticoUp.js';

const router = express.Router();

// Usar el middleware de imágenes configurado
router.put('/dispositivos/:id/imagen-diagnostico', 
  uploadMiddleware.image.single('file'),  // Usamos el middleware preconfigurado para imágenes
  updateImagenDiagnostico
);

export default router;
