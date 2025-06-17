'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ordenes_servicio', 'tipoServicio', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ordenes_servicio', 'tipoServicio', {
      type: Sequelize.ENUM('enTaller', 'domicilio'),
      allowNull: true
    });
  }
};