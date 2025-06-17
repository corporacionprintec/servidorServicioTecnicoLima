import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class AccesoAnonimo extends Model {
    static associate(models) {
      // Define aquí las asociaciones si son necesarias
    }
  }

  AccesoAnonimo.init({
    ticket: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'AccesoAnonimo',
    tableName: 'accesos_anonimos'
  });

  return AccesoAnonimo;
};