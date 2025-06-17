import { Tecnico } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

/**
 * @class TecnicoAuthService
 * @description Servicio para manejar la autenticación de técnicos
 */
export class TecnicoAuthService {
  /**
   * Autentica a un técnico por su teléfono, contraseña y rol
   * @param {string} telefono - Teléfono del técnico
   * @param {string} contrasena - Contraseña del técnico
   * @param {string} role - Rol proporcionado para login
   * @returns {Promise<Object>} Datos del técnico autenticado
   */
  async loginTecnico(telefono, contrasena, role) {
    logger.info(`Intento de login con teléfono: ${telefono}, rol: ${role}`);
    
    // Asumir "tecnico" por defecto si no se especifica rol
    const roleProvided = role || 'tecnico';

    // Buscar usuario por teléfono
    const user = await Tecnico.findOne({ 
      where: { telefono } 
    });

    if (!user) {
      logger.warn(`No se encontró un usuario con el teléfono: ${telefono}`);
      throw new NotFoundError("Credenciales incorrectas");
    }

    if (user.contrasena !== contrasena) {
      logger.warn(`Contraseña incorrecta para el usuario con teléfono: ${telefono}`);
      throw new NotFoundError("Credenciales incorrectas");
    }

    // Verificar el rol:
    // Si el usuario es administrador, se permite iniciar sesión con rol "tecnico" o "administrador".
    if (user.rol === 'administrador') {
      if (roleProvided !== 'tecnico' && roleProvided !== 'administrador') {
        logger.warn(`El rol proporcionado (${roleProvided}) no es permitido para un administrador`);
        throw new ValidationError("El rol no corresponde");
      }
    } else {
      // Para otros roles, se debe hacer una coincidencia exacta
      if (user.rol !== roleProvided) {
        logger.warn(`El rol proporcionado (${roleProvided}) no coincide con el rol del usuario (${user.rol})`);
        throw new ValidationError("El rol no corresponde");
      }
    }

    const userData = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      rol: user.rol
    };

    logger.info(`Login exitoso para usuario: ${user.id}`);
    return userData;
  }
}

export default new TecnicoAuthService();