'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tecnicos', 'contrasena', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'changeme' // Puedes cambiar el valor por defecto si lo deseas
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tecnicos', 'contrasena');
  }
}; 