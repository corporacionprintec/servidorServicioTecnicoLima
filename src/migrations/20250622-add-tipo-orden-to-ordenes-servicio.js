'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "ordenes_servicio",
      "tipo_orden",
      {
        type: Sequelize.ENUM("reparacion", "venta"),
        allowNull: false,
        defaultValue: "reparacion",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("ordenes_servicio", "tipo_orden");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_ordenes_servicio_tipo_orden";'
    );
  },
};
