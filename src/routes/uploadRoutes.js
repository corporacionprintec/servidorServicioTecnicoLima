import express from 'express';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import { uploadPhotos } from '../controllers/driveController.js';

const router = express.Router();

router.post('/photos', 
  uploadMiddleware.multiple.array('files', 5),
  uploadPhotos
);

export default router;
