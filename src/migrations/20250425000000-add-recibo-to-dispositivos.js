'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Agregamos el campo "recibo" como TEXT para almacenar la URL del PDF
    await queryInterface.addColumn('dispositivos', 'recibo', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir: eliminar la columna
    await queryInterface.removeColumn('dispositivos', 'recibo');
  }
}; 