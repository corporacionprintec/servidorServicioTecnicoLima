import models from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export class QrValidationService {
  async validarQr(qr) {
    const allowedPrefix = 'https://drive.google.com/drive/folders/';
    
    if (!qr) {
      throw new ValidationError('Se requiere el parámetro "qr"');
    }

    if (!qr.startsWith(allowedPrefix)) {
      throw new ValidationError(`El QR debe iniciar con "${allowedPrefix}"`);
    }

    const dispositivos = await models.Dispositivo.findAll({
      where: { qr_scan: qr },
      attributes: [
        'qr_scan',
        'modelo',
        'tipo_dispositivo',
        'diagnostico',
        'imagenen_diagnostico',
        'recibo',
        'tecnico_id',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: models.Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'telefono']
        },
        {
          model: models.OrdenServicio,
          as: 'ordenes',
          attributes: ['problema_descrito']
        },
        {
          model: models.Tecnico,
          as: 'tecnico',
          attributes: ['nombre', 'apellido', 'telefono','rol']
        }
      ]
    });

    if (dispositivos.length === 0) {
      throw new NotFoundError('El QR no coincide');
    }

    return dispositivos.map(dispositivo => ({
      qr_scan: dispositivo.qr_scan,
      modelo: dispositivo.modelo,
      tipo_dispositivo: dispositivo.tipo_dispositivo,
      diagnostico: dispositivo.diagnostico,
      imagenen_diagnostico: dispositivo.imagenen_diagnostico,
      recibo: dispositivo.recibo,
     
      createdAt: dispositivo.createdAt,
      updatedAt: dispositivo.updatedAt,
      nombre: dispositivo.cliente?.nombre || null,
      apellido: dispositivo.cliente?.apellido || null,
      telefono: dispositivo.cliente?.telefono || null,
      problemas_descritos: Array.isArray(dispositivo.ordenes)
        ? dispositivo.ordenes.map(orden => orden.problema_descrito)
        : (dispositivo.ordenes ? [dispositivo.ordenes.problema_descrito] : []),
        tecnico_id: dispositivo.tecnico_id,
        nombre_tecnico: dispositivo.tecnico?.nombre || null,
        apellido_tecnico: dispositivo.tecnico?.apellido || null,
        telefono_tecnico: dispositivo.tecnico?.telefono || null,
        rol_tecnico: dispositivo.tecnico?.rol || null
    }));
  }
}

export default new QrValidationService();