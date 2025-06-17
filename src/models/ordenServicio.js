import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class OrdenServicio extends Model {
    static associate(models) {
      // Asociaciones belongsTo
      OrdenServicio.belongsTo(models.Dispositivo, {
        foreignKey: 'dispositivo_id',
        as: 'dispositivo'
      });
      
      OrdenServicio.belongsTo(models.Tecnico, {
        foreignKey: 'tecnico_id',
        as: 'tecnico'
      });

      // Asociaciones hasMany
      if (models.RepuestoUsado) {
        OrdenServicio.hasMany(models.RepuestoUsado, {
          foreignKey: 'orden_id',
          as: 'repuestos'
        });
      }

      if (models.Pago) {
        OrdenServicio.hasMany(models.Pago, {
          foreignKey: 'orden_id',
          as: 'pagos'
        });
      }

      if (models.Comentario) {
        OrdenServicio.hasMany(models.Comentario, {
          foreignKey: 'orden_id',
          as: 'comentarios'
        });
      }
    }
  }

  OrdenServicio.init({
    dispositivo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dispositivos',
        key: 'id'
      }
    },
    tecnico_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tecnicos',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.ENUM(
        'pendiente', 
        'en_proceso', 
        'acudiendo', 
        'atentido', 
        'completado', 
        'por_entregar', 
        'entregado', 
        'cancelado'
      ),
      defaultValue: 'pendiente'
    },
    problema_descrito: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    audio: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    audio_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ticket: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    imagenes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // NUEVOS CAMPOS:
    // Indica si el cliente lleva el equipo al taller ("enTaller")
    // o solicita servicio a domicilio ("domicilio")
    tipoServicio: {
      type: DataTypes.ENUM('enTaller', 'domicilio'),
      allowNull: true
    },
    // Almacena la dirección o las coordenadas (opcional)
    direccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Almacena la fecha y hora del servicio; puede ser un formato ISO o una descripción manual
    fechaHoraServicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    costo_acordado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_diagnostico: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_abandono: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'OrdenServicio',
    tableName: 'ordenes_servicio',
    timestamps: true
  });

  return OrdenServicio;
};
