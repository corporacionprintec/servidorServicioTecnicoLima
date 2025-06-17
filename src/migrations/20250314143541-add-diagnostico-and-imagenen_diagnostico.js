'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dispositivos', 'diagnostico', {
      type: Sequelize.TEXT,
      allowNull: true // O false, según tus requerimientos
    });
    await queryInterface.addColumn('dispositivos', 'imagenen_diagnostico', {
      type: Sequelize.TEXT,
      allowNull: true // O false, según tus requerimientos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dispositivos', 'diagnostico');
    await queryInterface.removeColumn('dispositivos', 'imagenen_diagnostico');
  }
};
