
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Gasto extends Model {
    static associate(models) {
      Gasto.belongsTo(models.Tecnico, {
        foreignKey: 'responsable',
        as: 'tecnico'
      });
    }
  }

  Gasto.init({
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    responsable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID del técnico responsable"
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("taller", "tienda"),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Gasto',
    tableName: "Gastos",
    timestamps: true,
  });

  return Gasto;
}
