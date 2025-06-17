import { Model, DataTypes } from 'sequelize';

const CierreCaja = (sequelize) => {
  class CierreCajaModel extends Model {
    static associate(models) {
      CierreCajaModel.hasMany(models.Pago, {
        foreignKey: 'cierre_caja_id',
        as: 'pagos',
      });
      CierreCajaModel.belongsTo(models.Tecnico, {
        foreignKey: 'tecnico_id',
        as: 'tecnico',
      });
    }
  }
  CierreCajaModel.init(
    {
      fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      tecnico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      monto_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      observaciones: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'CierreCaja',
      tableName: 'cierres_caja',
      timestamps: true,
    }
  );
  return CierreCajaModel;
};

export default CierreCaja;
