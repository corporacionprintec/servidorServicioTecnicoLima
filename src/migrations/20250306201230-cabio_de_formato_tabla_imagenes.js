'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ordenes_servicio', 'imagenes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ordenes_servicio', 'imagenes', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};
