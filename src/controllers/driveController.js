import { google } from 'googleapis';
import stream from 'stream';
import dotenv from 'dotenv';
import { uploadToDrive } from '../utils/driveHandler.js';

// Cargar variables de entorno
dotenv.config();


export const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.error('No se han subido archivos.');
      return res.status(400).json({ error: 'No se han subido archivos.' });
    }

    const uploadedFiles = [];
    const folderId = process.env.GOOGLE_DRIVE_AUDIOS_FOLDER_ID;

    for (const file of req.files) {
      const result = await uploadToDrive(file, file.filename, folderId);
      
      uploadedFiles.push({
        fileId: result.id,
        webViewLink: result.webViewLink
      });
    }

    return res.status(200).json({ uploadedFiles });
  } catch (error) {
    console.error('Error al subir las fotos:', error);
    return res.status(500).json({ error: 'Error al subir los archivos a Google Drive' });
  }
};