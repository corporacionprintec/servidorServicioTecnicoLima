import express from 'express';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import { updateRecibo } from '../controllers/reciboController.js';

const router = express.Router();

// Usar el middleware de pdf configurado para recibos
router.put('/dispositivos/:id/recibo', 
  uploadMiddleware.pdf.single('file'),  // Usamos el middleware para PDFs
  updateRecibo
);

export default router; 