'use strict';

export default  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tecnicos', 'rol', {
      type: Sequelize.STRING, // Puedes ajustar el tipo de dato según tus necesidades
      allowNull: true,       // Permite que la columna acepte valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tecnicos', 'rol');
  }
};
