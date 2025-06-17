import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Comentario extends Model {
    static associate(models) {
      Comentario.belongsTo(models.OrdenServicio, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
    }
  }

  Comentario.init({
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT
    },
    url_audio: {
      type: DataTypes.TEXT
    },
    audio_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Comentario',
    tableName: 'comentarios'
  });

  return Comentario;
};