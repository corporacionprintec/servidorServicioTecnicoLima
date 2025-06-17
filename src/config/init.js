import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear directorios necesarios
const directories = [
  path.join(__dirname, '../../uploads'),
  path.join(__dirname, '../../uploads/audio')
];

export function initializeDirectories() {
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}
