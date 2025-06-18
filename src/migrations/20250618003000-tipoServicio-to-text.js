'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Cambia el tipo de la columna tipoServicio a TEXT
    await queryInterface.changeColumn('ordenes_servicio', 'tipoServicio', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Vuelve a ENUM en caso de rollback
    await queryInterface.changeColumn('ordenes_servicio', 'tipoServicio', {
      type: Sequelize.ENUM('enTaller', 'domicilio'),
      allowNull: true
    });
  }
};
