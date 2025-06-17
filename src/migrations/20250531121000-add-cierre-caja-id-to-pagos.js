'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("pagos", "cierre_caja_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "cierres_caja",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("pagos", "cierre_caja_id");
  },
};
