'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE dispositivos d
      SET tecnico_id = (
        SELECT t.id
        FROM tecnicos t
        WHERE CONCAT(t.nombre, ' ', t.apellido) = d.detalles
      )
      WHERE EXISTS (
        SELECT 1
        FROM tecnicos t
        WHERE CONCAT(t.nombre, ' ', t.apellido) = d.detalles
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Si quieres revertir los cambios, puedes dejarlo en blanco o hacerlo como desees
    await queryInterface.sequelize.query(`
      UPDATE dispositivos d
      SET tecnico_id = NULL
      WHERE tecnico_id IS NOT NULL;
    `);
  }
};
