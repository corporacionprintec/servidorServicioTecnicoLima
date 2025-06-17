import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Garantia extends Model {
    static associate(models) {
      Garantia.belongsTo(models.OrdenServicio, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
    }
  }

  Garantia.init({
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tiempo_garantia: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    condiciones: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Garantia',
    tableName: 'garantias'
  });

  return Garantia;
};