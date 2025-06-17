'use strict';


export default  {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('ordenes_servicio', 'imagenes', {
      type: Sequelize.STRING(255), // Equivalente a VARCHAR(255)
      allowNull: true, // Cambia a false si no quieres permitir valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('ordenes_servicio', 'imagenes');
  },
};
