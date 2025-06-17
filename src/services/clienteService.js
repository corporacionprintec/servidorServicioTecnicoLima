import { Op } from 'sequelize';
import { Cliente } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

/**
 * @class ClienteService
 * @description Servicio para gestionar los clientes
 */
export class ClienteService {
  /**
   * Crea un nuevo cliente
   * @param {Object} data - Datos del cliente
   * @param {Object} options - Opciones de transacción
   * @returns {Promise<Cliente>} Cliente creado
   */
  async createCliente(data, options = {}) {
    try {
      const { nombre, apellido, email, telefono, direccion } = data;

      const cliente = await Cliente.create({
        nombre,
        apellido,
        email,
        telefono,
        direccion
      }, options);

      logger.info(`Cliente creado con ID: ${cliente.id}`);
      return cliente;
    } catch (error) {
      logger.error('Error al crear cliente:', error);
      throw error;
    }
  }

  /**
   * Obtiene un cliente por su ID
   * @param {number} id - ID del cliente
   * @returns {Promise<Cliente>} Cliente encontrado
   */
  async getClienteById(id) {
    const cliente = await Cliente.findByPk(id, {
      include: ['dispositivos']
    });

    if (!cliente) {
      throw new NotFoundError(`No se encontró el cliente con ID: ${id}`);
    }

    return cliente;
  }
  
  /**
   * Obtiene un cliente por su número de telefono
   * @param {string} telefono - Número de telefono del cliente
   * @returns {Promise<Cliente>} Cliente encontrado o null
   */
  async getClienteByTelefono(telefono) {
    const cliente = await Cliente.findOne({
      where: { telefono }
    });
    return cliente;
  }

  /**
   * Busca clientes por diferentes criterios
   * @param {Object} filters - Filtros de búsqueda
   * @param {number} page - Número de página
   * @param {number} limit - Límite de resultados por página
   * @returns {Promise<Object>} Resultados paginados
   */
  async searchClientes(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.nombre) {
      where.nombre = { [Op.iLike]: `%${filters.nombre}%` };
    }

    if (filters.email) {
      where.email = { [Op.iLike]: `%${filters.email}%` };
    }

    if (filters.telefono) {
      where.telefono = { [Op.iLike]: `%${filters.telefono}%` };
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      include: ['dispositivos'],
      offset,
      limit,
      order: [['nombre', 'ASC']]
    });

    return {
      clientes: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  /**
   * Actualiza un cliente
   * @param {number} id - ID del cliente
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Cliente>} Cliente actualizado
   */
  async updateCliente(id, data) {
    const cliente = await this.getClienteById(id);

    if (data.email && data.email !== cliente.email) {
      const existingCliente = await Cliente.findOne({
        where: { email: data.email }
      });
      if (existingCliente) {
        throw new ValidationError('Ya existe un cliente con este email');
      }
    }

    await cliente.update(data);
    logger.info(`Cliente ${id} actualizado`);

    return cliente;
  }

  /**
   * Elimina un cliente
   * @param {number} id - ID del cliente
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async deleteCliente(id) {
    const cliente = await this.getClienteById(id);
    await cliente.destroy();
    logger.info(`Cliente ${id} eliminado`);
    return true;
  }

  /**
   * Obtiene el historial de órdenes de servicio de un cliente
   * @param {number} id - ID del cliente
   * @returns {Promise<Array>} Lista de órdenes de servicio
   */
  async getHistorialServicio(id) {
    const cliente = await Cliente.findByPk(id, {
      include: [{
        association: 'dispositivos',
        include: [{
          association: 'ordenes',
          include: ['tecnico']
        }]
      }]
    });

    if (!cliente) {
      throw new NotFoundError(`No se encontró el cliente con ID: ${id}`);
    }

    // Aplanar el historial de órdenes
    const historial = cliente.dispositivos.reduce((ordenes, dispositivo) => {
      return ordenes.concat(dispositivo.ordenes.map(orden => ({
        ...orden.toJSON(),
        dispositivo: {
          id: dispositivo.id,
          tipo: dispositivo.tipo,
          marca: dispositivo.marca,
          modelo: dispositivo.modelo
        }
      })));
    }, []);

    // Ordenar por fecha de creación descendente
    return historial.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}
