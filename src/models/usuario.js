import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Define aquí las asociaciones si son necesarias
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    external_id: {
      type: DataTypes.STRING(255),
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios'
  });

  return Usuario;
};