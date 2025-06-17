import { Dispositivo } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
export class DispositivoService {
  async createDispositivo(data, options = {}) {
    try {
      const dispositivo = await Dispositivo.create({
        ...data,
        tecnico_id: data.tecnico_id
      }, options);
      return dispositivo;
    } catch (error) {
      throw error;
    }
  }

  async getDispositivoById(id) {
    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      throw new NotFoundError('Dispositivo no encontrado');
    }
    return dispositivo;
  }

  async updateDispositivo(id, data) {
    const dispositivo = await this.getDispositivoById(id);
    try {
      await dispositivo.update({
        ...data,
        tecnico_id: data.tecnico_id
      });
      return dispositivo;
    } catch (error) {
      throw error;
    }
  }

  async deleteDispositivo(id) {
    const dispositivo = await this.getDispositivoById(id);
    try {
      await dispositivo.destroy();
    } catch (error) {
      throw error;
    }
  }

  async searchDispositivos(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.tecnico_id) {
      where.tecnico_id = filters.tecnico_id;
    }
    if (filters.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters.modelo) {
      where.modelo = { [Op.iLike]: `%${filters.modelo}%` };
    }
    if (filters.marca) {
      where.marca = { [Op.iLike]: `%${filters.marca}%` };
    }

    try {
      const { count, rows } = await Dispositivo.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        dispositivos: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new AppError('Error al buscar dispositivos', 400);
    }
  }

  async getDispositivosByCliente(clienteId) {
    try {
      const dispositivos = await Dispositivo.findAll({
        where: { 
          clienteId,
          tecnico_id: { [Op.not]: null }
        },
        order: [['createdAt', 'DESC']]
      });
      return dispositivos;
    } catch (error) {
      throw new AppError('Error al obtener los dispositivos del cliente', 400);
    }
  }
}