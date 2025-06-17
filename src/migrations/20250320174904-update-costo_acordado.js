'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Primero, elimina el valor por defecto si existe
    await queryInterface.sequelize.query(`
      ALTER TABLE ordenes_servicio 
      ALTER COLUMN costo_acordado DROP DEFAULT;
    `);

    // Luego, cambia el tipo de dato usando una cláusula USING para la conversión
    await queryInterface.sequelize.query(`
      ALTER TABLE ordenes_servicio 
      ALTER COLUMN costo_acordado TYPE BOOLEAN USING 
      (CASE 
         WHEN costo_acordado IS NULL THEN NULL
         WHEN costo_acordado = 0 THEN false
         ELSE true 
       END);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // En el downgrade se revierte la conversión: false se convierte en 0, true en 1
    await queryInterface.sequelize.query(`
      ALTER TABLE ordenes_servicio 
      ALTER COLUMN costo_acordado TYPE DECIMAL(10,2) USING 
      (CASE 
         WHEN costo_acordado IS NULL THEN NULL
         WHEN costo_acordado = false THEN 0
         ELSE 1 
       END);
    `);
  }
};
