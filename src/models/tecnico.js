import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Tecnico extends Model {
    static associate(models) {
      Tecnico.hasMany(models.OrdenServicio, {
        foreignKey: 'tecnico_id',
        as: 'ordenes'
      });
    }
  }

  Tecnico.init({
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: 'tecnico', // o el valor que prefieras
    }
  }, {
    sequelize,
    modelName: 'Tecnico',
    tableName: 'tecnicos'
  });

  return Tecnico;
};
