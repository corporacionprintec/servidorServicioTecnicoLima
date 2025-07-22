import swaggerJSDoc from 'swagger-jsdoc';
import { Cliente, Dispositivo, OrdenServicio, Tecnico, RepuestoUsado, Pago, Comentario } from '../models/index.js';
import { generateModelProperties } from './swagger/schemaGenerator.js';

const ordenServicioProperties = generateModelProperties(OrdenServicio);
const clienteProperties = generateModelProperties(Cliente);
const dispositivoProperties = {
  ...generateModelProperties(Dispositivo),
  tecnicoRecibio: {
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'integer' },
      nombre: { type: 'string' },
      apellido: { type: 'string' }
    }
  },
  tecnicoEntrego: {
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'integer' },
      nombre: { type: 'string' },
      apellido: { type: 'string' }
    }
  }
};
const tecnicoProperties = generateModelProperties(Tecnico);
const RepuestoUsadoProperties = generateModelProperties(RepuestoUsado);
const PagoProperties = generateModelProperties(Pago);
const ComentarioProperties = generateModelProperties(Comentario);

const ordenServicioDetailProperties = {
  ...ordenServicioProperties,
  dispositivo:{
    type: 'object',
    properties: dispositivoProperties
  },
  tecnico: {
    type: 'object',
    nullable: true,
    properties: tecnicoProperties
  },
  repuestos: {
    type: 'array',
    items: {
      type: 'object',
      properties: RepuestoUsadoProperties
    }
  },
  pagos: {
    type: 'array',
    items: {
      type: 'object',
      properties: PagoProperties
    }
  },
  comentarios: {
    type: 'array',
    items: {
      type: 'object',
      properties: ComentarioProperties
    }
  }
}

const swaggerDefinition = {
  // ... configuración general ...
  openapi: '3.0.0',
  info: {
    title: 'API de Servicio Técnico',
    version: '1.0.0',
    description: 'API para la gestión de servicios técnicos de dispositivos',
    contact: {
      name: 'Soporte',
      email: 'soporte@printec.com'
    }
  },
  servers: [
    {
      url: '/',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    schemas: {
      // Esquemas base
      OrdenServicio: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success'
          },
          message: {
            type: 'string',
            example: 'Orden de servicio creada exitosamente'
          },
          data: {
            type: 'object',
            properties: ordenServicioProperties
          }
        }
      },
      // Esquemas detallados
      OrdenServicioDetail: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success'
          },
          message: {
            type: 'string',
            example: 'Orden de servicio obtenida exitosamente'
          },
          data: {
            type: 'object',
            properties: ordenServicioDetailProperties
          },
          metadata: {
            type: 'object',
          }

        }
      },
      // Esquemas de Paginación
      OrdenServicioList: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success'
          },
          message: {
            type: 'string',
            example: 'Listado de ordenes obtenido exitosamente'
          },
          data: {
            type: 'object',
            properties: {
              ordenes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...ordenServicioProperties,
                    dispositivo:{
                      type: 'object',
                      properties: {
                        ...dispositivoProperties,
                        cliente: {
                          type: 'object',
                          properties: clienteProperties
                        },
                      }
                    },
                    tecnico: {
                      type: 'object',
                      nullable: true,
                      properties: tecnicoProperties
                    }
                  }
                }
              },
              pagination: {
                type: 'object',
                properties: {
                  total: {
                    type: 'integer',
                    example: 100
                  },
                  page: {
                    type: 'integer',
                    example: 1
                  },
                  limit: {
                    type: 'integer',
                    example: 10
                  },
                  pages: {
                    type: 'integer',
                    example: 10
                  }
                }
              },
            }
          },
          metadata: {
            type: 'object',
          }
        }
      },
      // Esquemas de exito solo mensaje
      Success: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success'
          },
          message: {
            type: 'string',
            example: 'Operación exitosa'
          },
        }
      },
      // Esquemas de error
      Error: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Descripción del error' }
        }
      },
      Gasto: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          descripcion: { type: 'string' },
          cantidad: { type: 'number', format: 'float' },
          responsable: { type: 'integer', example: 1 },
          fecha: { type: 'string', format: 'date' },
          tipo: { type: 'string', enum: ['taller', 'tienda'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      GastoInput: {
        type: 'object',
        required: ['descripcion', 'cantidad', 'responsable', 'fecha', 'tipo'],
        properties: {
          descripcion: { type: 'string', example: 'Compra de repuestos' },
          cantidad: { type: 'number', example: 150.50 },
          responsable: { type: 'integer', example: 1 },
          fecha: { type: 'string', format: 'date', example: '2025-07-19' },
          tipo: { type: 'string', example: 'taller' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.js']
};

export default swaggerJSDoc(options);