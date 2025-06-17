'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    // Agregar el nuevo valor "acudiendo" al tipo ENUM de estado
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_ordenes_servicio_estado" ADD VALUE IF NOT EXISTS 'acudiendo';
    `);

    // Agregar el nuevo valor "atentido" al tipo ENUM de estado
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_ordenes_servicio_estado" ADD VALUE IF NOT EXISTS 'atentido';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // La eliminación de valores de un ENUM en PostgreSQL no es trivial ni segura,
    // ya que podría existir datos con esos valores. Por ello, se recomienda no implementar
    // la migración down para esta operación.
    return Promise.resolve();
  }
};
