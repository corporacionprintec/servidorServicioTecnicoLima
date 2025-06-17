import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.hasMany(models.Dispositivo, {
        foreignKey: 'cliente_id',
        as: 'dispositivos'
      });
    }
  }

  Cliente.init({
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes'
  });

  return Cliente;
};