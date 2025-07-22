'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Cambia el nombre del ENUM y la tabla según tu modelo real si es necesario
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Cambiar el tipo ENUM agregando 'venta_rapida'
      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_ordenes_servicio_estado') THEN
            CREATE TYPE "enum_ordenes_servicio_estado" AS ENUM ('pendiente', 'en_proceso', 'entregado', 'cancelado', 'venta_rapida');
          ELSE
            ALTER TYPE "enum_ordenes_servicio_estado" ADD VALUE IF NOT EXISTS 'venta_rapida';
          END IF;
        END$$;
      `, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Quitar 'venta_rapida' del ENUM (no soportado directamente, se recrea el tipo)
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Renombrar el tipo actual
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_ordenes_servicio_estado" RENAME TO "enum_ordenes_servicio_estado_old";
      `, { transaction });
      // 2. Crear el nuevo tipo sin 'venta_rapida'
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_ordenes_servicio_estado" AS ENUM ('pendiente', 'en_proceso', 'entregado', 'cancelado');
      `, { transaction });
      // 3. Alterar la columna para usar el nuevo tipo
      await queryInterface.sequelize.query(`
        ALTER TABLE "ordenes_servicio" ALTER COLUMN "estado" TYPE "enum_ordenes_servicio_estado" USING "estado"::text::"enum_ordenes_servicio_estado";
      `, { transaction });
      // 4. Borrar el tipo viejo
      await queryInterface.sequelize.query(`
        DROP TYPE "enum_ordenes_servicio_estado_old";
      `, { transaction });
    });
  }
};
