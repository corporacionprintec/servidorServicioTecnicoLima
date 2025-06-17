import express from 'express';
import { updateQrScan } from '../controllers/dispositivoControlerScanup.js';

const router = express.Router();

// Endpoint PUT para actualizar el campo qr_scan de un dispositivo
router.put('/:id', updateQrScan);

export default router;
