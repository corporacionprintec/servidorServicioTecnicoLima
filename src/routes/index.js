import { Router } from 'express';
import ordenServicioRoutes from './ordenServicioRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import repuestoRoutes from './repuestoRoutes.js';
import comentarioRoutes from './comentarioRoutes.js';
import dispositivoRoutes from './dispositivoRoutes.js';
import reciboRoutes from './reciboRoutes.js';
import { createUploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Define routes
router.use('/ordenes', ordenServicioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/repuestos', repuestoRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/dispositivos', dispositivoRoutes);
router.use('/api', reciboRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

export default router;
