'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    try {
      // Eliminamos el valor por defecto de la columna tipoServicio
      await queryInterface.sequelize.query('ALTER TABLE ordenes_servicio ALTER COLUMN "tipoServicio" DROP DEFAULT');
    } catch (error) {
      console.error('Error en la migración:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Restauramos el valor por defecto original
      await queryInterface.sequelize.query('ALTER TABLE ordenes_servicio ALTER COLUMN "tipoServicio" SET DEFAULT \'enTaller\'');
    } catch (error) {
      console.error('Error en el rollback:', error);
      throw error;
    }
  }
};