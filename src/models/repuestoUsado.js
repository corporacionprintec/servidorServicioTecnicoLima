import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class RepuestoUsado extends Model {
    static associate(models) {
      RepuestoUsado.belongsTo(models.OrdenServicio, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
    }
  }

  RepuestoUsado.init({
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    repuesto_nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RepuestoUsado',
    tableName: 'repuestos_usados',
    paranoid: false 
  });

  return RepuestoUsado;
};