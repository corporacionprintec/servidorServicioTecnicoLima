import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Dispositivo extends Model {
    static associate(models) {
      Dispositivo.belongsTo(models.Cliente, {
        foreignKey: 'cliente_id',
        as: 'cliente'
      });
      Dispositivo.belongsTo(models.Tecnico, {
        foreignKey: 'tecnico_id',
        as: 'tecnico'
      });
      Dispositivo.belongsTo(models.Tecnico, {
        foreignKey: 'tecnico_recibio',
        as: 'tecnicoRecibio'
      });
      Dispositivo.belongsTo(models.Tecnico, {
        foreignKey: 'tecnico_entrego',
        as: 'tecnicoEntrego'
      });
      Dispositivo.hasMany(models.OrdenServicio, {
        foreignKey: 'dispositivo_id',
        as: 'ordenes'
      });
    }
  }

  Dispositivo.init({
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tecnico_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tecnicos',
        key: 'id'
      }
    },
    tipo_dispositivo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    numero_serie: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true
    },
    detalles: {
      type: DataTypes.TEXT
    },
    qr_scan: {
      type: DataTypes.STRING,
      allowNull: true, // Ahora permite nulos y NO es único
      // unique: true // Eliminado para permitir duplicados
    },
    diagnostico: {
      type: DataTypes.STRING(1000), // Cambiado de TEXT a STRING(1000)
      allowNull: true
    },
    imagenen_diagnostico: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    costo_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    recibo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tecnico_recibio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tecnico_entrego: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_diagnostico: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha y hora en que se realizó el diagnóstico'
    }
  }, {
    sequelize,
    modelName: 'Dispositivo',
    tableName: 'dispositivos'
  });

  return Dispositivo;
};
