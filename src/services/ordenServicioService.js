import { Op } from 'sequelize';
import { OrdenServicio, Cliente, Dispositivo, Tecnico, RepuestoUsado, Pago, Comentario } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../config/logger.js';

export class OrdenServicioService {
  async createOrden(ordenData, options = {}) {
    try {
      // Validar datos requeridos
      if (!ordenData.cliente_id) throw new ValidationError('El ID del cliente es requerido');
      if (!ordenData.dispositivo_id) throw new ValidationError('El ID del dispositivo es requerido');
      if (!ordenData.problema_descrito) throw new ValidationError('La descripción del problema es requerida');

      // Verificar que exista el cliente
      const cliente = await Cliente.findByPk(ordenData.cliente_id, options);
      if (!cliente) throw new NotFoundError('Cliente no encontrado');

      // Verificar que exista el dispositivo
      const dispositivo = await Dispositivo.findByPk(ordenData.dispositivo_id, options);
      if (!dispositivo) throw new NotFoundError('Dispositivo no encontrado');

      // Verificar que el dispositivo pertenezca al cliente
      if (dispositivo.cliente_id !== ordenData.cliente_id) {
        throw new ValidationError('El dispositivo no pertenece al cliente especificado');
      }

      // Generar número de ticket único
      const ticket = await this.generateTicketNumber(options);

      // Crear la orden, ahora incluyendo el campo "imagenes"
      const orden = await OrdenServicio.create({
        cliente_id: ordenData.cliente_id,
        dispositivo_id: ordenData.dispositivo_id,
        problema_descrito: ordenData.problema_descrito,
        prioridad: ordenData.prioridad || 'normal',
        estado: 'pendiente',
        ticket,
        fecha_ingreso: new Date(),
        audio: ordenData.audio || null,
        audio_id: ordenData.audio_id || null,
        imagenes: ordenData.imagenes || null,
        tipoServicio: ordenData.tipoServicio || '',
        direccion: ordenData.direccion || null,
        fechaHoraServicio: ordenData.fechaHoraServicio || null,
        tipo_orden: ordenData.tipo_orden || null // Ahora permite nulo y no tiene valor por defecto
      }, options);
      
      logger.info(`Nueva orden de servicio creada - Ticket: ${ticket}`);
      return orden;
    } catch (error) {
      logger.error('Error al crear orden de servicio:', error);
      throw error;
    }
  }

  async generateTicketNumber(options = {}) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const prefix = `OS${year}${month}`;
    
    const lastTicket = await OrdenServicio.findOne({
      attributes: ['ticket'],
      where: {
        ticket: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['ticket', 'DESC']],
      ...options
    });

    let sequence = 1;
    if (lastTicket) {
      const lastSequence = parseInt(lastTicket.ticket.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  async getOrdenById(id, options = {}) {
    const orden = await OrdenServicio.findByPk(id, {
      attributes: { exclude: [] }, // Incluye todos los campos, incluido tipo_orden
      include: [
        { 
          model: Dispositivo,
          as: 'dispositivo',
          include: [
            { model: Cliente, as: 'cliente' },
            { model: Tecnico, as: 'tecnico' },
            { model: Tecnico, as: 'tecnicoRecibio', attributes: ['id', 'nombre', 'apellido'] },
            { model: Tecnico, as: 'tecnicoEntrego', attributes: ['id', 'nombre', 'apellido'] }
          ]
        },
        { model: Tecnico, as: 'tecnico' },
        { model: RepuestoUsado, as: 'repuestos' },
        { model: Pago, as: 'pagos' },
        { model: Comentario, as: 'comentarios' }
      ],
      ...options
    });

    if (!orden) throw new NotFoundError('Orden de servicio');
    
    // Normalizar el campo recibo para garantizar consistencia
    if (orden.dispositivo && orden.dispositivo.recibo === '') {
      orden.dispositivo.recibo = null;
    }
    
    return orden;
  }
  
  async getOrdenByTicket(ticket, options = {}) {
    const orden = await OrdenServicio.findOne({
      where: { ticket },
      include: [
        { model: Cliente },
        { model: Dispositivo },
        { model: Tecnico }
      ],
      ...options
    });

    if (!orden) throw new NotFoundError('Orden de servicio');
    
    // Normalizar el campo recibo para garantizar consistencia
    if (orden.dispositivo && orden.dispositivo.recibo === '') {
      orden.dispositivo.recibo = null;
    }
    
    return orden;
  }

  async listOrdenes(options = {}) {
    const {
      page = 1,
      limit = 10,
      estado,
      prioridad,
      tecnico_id,
      cliente_id,
      sequelize
    } = options;
  
    const where = {};
    if (estado) where.estado = estado;
    if (prioridad) where.prioridad = prioridad;
    if (tecnico_id) where.tecnico_id = tecnico_id;
  
    const { count, rows } = await OrdenServicio.findAndCountAll({
      attributes: { exclude: [] }, // Incluye todos los campos, incluido tipo_orden
      where,
      include: [
        { 
          model: Dispositivo,
          as: 'dispositivo',
          include: [
            { 
              model: Cliente,
              as: 'cliente',
              where: cliente_id ? { id: cliente_id } : undefined
            },
            { 
              model: Tecnico,
              as: 'tecnico',
              attributes: ['id', 'nombre', 'apellido', 'telefono','rol'] // Campos específicos del técnico
            }
          ]
        },
      ],
      order: [['fecha_ingreso', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
      ...sequelize
    });
  
    // Normalizar el campo recibo en todos los dispositivos
    for (const orden of rows) {
      if (orden.dispositivo && orden.dispositivo.recibo === '') {
        orden.dispositivo.recibo = null;
      }
      
      // Normalizar campos vacíos del técnico del dispositivo
      if (orden.dispositivo?.tecnico) {
        if (orden.dispositivo.tecnico.nombre === '') orden.dispositivo.tecnico.nombre = null;
        if (orden.dispositivo.tecnico.apellido === '') orden.dispositivo.tecnico.apellido = null;
      }
      
      // Normalizar campos vacíos del técnico de la orden
      if (orden.tecnico) {
        if (orden.tecnico.nombre === '') orden.tecnico.nombre = null;
        if (orden.tecnico.apellido === '') orden.tecnico.apellido = null;
      }
    }
  
    return {
      ordenes: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async updateStatus(id, estado, options = {}) {
    // Se agregan los estados 'acudiendo' y 'atentido' a los estados válidos
    const estadosValidos = [
      'pendiente', 
      'en_proceso', 
      'acudiendo', 
      'atentido', 
      'completado', 
      'por_entregar', 
      'entregado', 
      'cancelado'
    ];
    if (!estadosValidos.includes(estado)) {
      throw new ValidationError(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }
  
    const orden = await this.getOrdenById(id, options);
  
    try {
      // Actualizar la fecha correspondiente según el nuevo estado
      const updateFields = { estado };
      if (estado === 'entregado') {
        updateFields.fecha_entrega = new Date();
        updateFields.fecha_diagnostico = undefined;
        updateFields.fecha_abandono = undefined;
        // Solo se actualiza fecha_entrega
      } else if (estado === 'en_proceso') {
        updateFields.fecha_diagnostico = new Date();
        updateFields.fecha_entrega = undefined;
        updateFields.fecha_abandono = undefined;
        // Solo se actualiza fecha_diagnostico
      } else if (estado === 'cancelado') {
        updateFields.fecha_abandono = new Date();
        updateFields.fecha_entrega = undefined;
        updateFields.fecha_diagnostico = undefined;
        // Solo se actualiza fecha_abandono
      }
      // Elimina los undefined para no sobreescribir otros campos
      Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
      await orden.update(updateFields, options);
      console.log('[LOG] Orden actualizada:', orden.id, updateFields);
      return orden;
    } catch (error) {
      logger.error(`Error al actualizar estado de orden ${orden.ticket}:`, error);
      throw error;
    }
  }
  

  async asignarTecnico(ordenId, tecnicoId, options = {}) {
    const orden = await this.getOrdenById(ordenId, options);
    const tecnico = await Tecnico.findByPk(tecnicoId, options);
    if (!tecnico) throw new NotFoundError('Técnico');

    try {
      await orden.update({
        tecnico_id: tecnicoId,
        estado: 'en_proceso',
        fecha_asignacion: new Date()
      }, options);

      logger.info(`Técnico ${tecnicoId} asignado a orden ${orden.ticket}`);
      return orden;
    } catch (error) {
      logger.error(`Error al asignar técnico a orden ${orden.ticket}:`, error);
      throw error;
    }
  }

  async deleteOrden(id, options = {}) {
    try {
      const deleted = await OrdenServicio.destroy({
        where: { id },
        ...options
      });

      if (!deleted) throw new NotFoundError('Orden no encontrada');
      return true;
    } catch (error) {
      logger.error(`Error al eliminar orden ${id}:`, error);
      throw error;
    }
  }
}
