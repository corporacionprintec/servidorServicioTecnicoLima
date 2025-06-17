'use strict';

export default  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('dispositivos', 'diagnostico', {
      type: Sequelize.STRING(1000),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('dispositivos', 'diagnostico', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
};