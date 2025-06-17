import { Model, DataTypes } from 'sequelize';

const Pago = (sequelize) => {
  class PagoModel extends Model {
    static associate(models) {
      PagoModel.belongsTo(models.OrdenServicio, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
      PagoModel.belongsTo(models.CierreCaja, {
        foreignKey: 'cierre_caja_id',
        as: 'cierreCaja'
      });
    }
  }

  PagoModel.init({
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    metodo_pago: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    cierre_caja_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Pago',
    tableName: 'pagos'
  });

  return PagoModel;
};

export default Pago;