'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('dispositivos', 'costo_total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('dispositivos', 'costo_total');
  }
};