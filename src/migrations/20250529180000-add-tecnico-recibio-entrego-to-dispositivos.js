'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dispositivos', 'tecnico_recibio', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('dispositivos', 'tecnico_entrego', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dispositivos', 'tecnico_recibio');
    await queryInterface.removeColumn('dispositivos', 'tecnico_entrego');
  }
};
