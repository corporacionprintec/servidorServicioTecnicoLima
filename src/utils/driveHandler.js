import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { DatabaseError, ValidationError } from "./errors.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de la cuenta de servicio
const serviceAccountFile =path.join(__dirname, "../config/sesionCredential.json");

// Cargar las credenciales del archivo JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFile));
serviceAccount.type = process.env.GOOGLE_TYPE;
serviceAccount.project_id = process.env.GOOGLE_PROJECT_ID;
serviceAccount.private_key_id = process.env.GOOGLE_PRIVATE_KEY_ID;
serviceAccount.client_email = process.env.GOOGLE_CLIENT_EMAIL;
serviceAccount.client_id = process.env.GOOGLE_CLIENT_ID;
serviceAccount.auth_uri = process.env.GOOGLE_AUTH_URI;
serviceAccount.token_uri = process.env.GOOGLE_TOKEN_URI;
serviceAccount.auth_provider_x509_cert_url =
  process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL;
serviceAccount.client_x509_cert_url = process.env.GOOGLE_CLIENT_X509_CERT_URL;
serviceAccount.universe_domain = process.env.GOOGLE_UNIVERSE_DOMAIN;
// Configurar las credenciales para la autenticación
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Crear una instancia del cliente de Google Drive
const drive = google.drive({ version: "v3", auth });

/**
 * Sube un archivo a Google Drive
 * @async
 * @param {Object} file - Objeto del archivo a subir (generalmente proporcionado por multer)
 * @param {string} fileName - Nombre que tendrá el archivo en Google Drive
 * @param {string} carpeta - ID de la carpeta de Google Drive donde se subirá el archivo
 * @param {Object} [transaction=null] - Objeto de transacción de Sequelize para manejo de rollback
 * @returns {Promise<Object>} Objeto con el webViewLink y el id del archivo subido
 * @throws {Error} Si hay un error durante la subida del archivo
 */
export const uploadToDrive = async (file, fileName, carpeta, transaction = null) => {
  try {
    if (!file || !file.path) {
        throw new ValidationError('Archivo no proporcionado o inválido');
      }
    const fileMetadata = {
      name: fileName,
      parents: [carpeta],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    // Eliminar el archivo temporal
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error("Error al eliminar el archivo:", err);
    }

    const webViewLink = response.data.webViewLink;
    const id = response.data.id;

    return { webViewLink, id };
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error(error);
    throw new DatabaseError(`Error al subir el archivo a Google Drive: ${error.message || 'Error desconocido'}`);
  }
};

/**
 * Elimina un archivo de Google Drive por su ID
 * @async
 * @param {string} fileId - ID del archivo en Google Drive que se desea eliminar
 * @param {Object} [transaction=null] - Objeto de transacción de Sequelize para manejo de rollback
 * @throws {Error} Si hay un error durante la eliminación del archivo
 */
export const deleteFileById = async (fileId, transaction = null) => {
  try {
    await drive.files.delete({ fileId });
  } catch (error) {
    if (transaction) await transaction.rollback()
    throw new DatabaseError("Error al eliminar el archivo de Google Drive");
  }
};
