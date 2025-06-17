'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    // Agregar el valor "por_entregar" si aún no existe
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_ordenes_servicio_estado" ADD VALUE IF NOT EXISTS 'por_entregar';`
    );
    // Agregar el valor "entregado" si aún no existe
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_ordenes_servicio_estado" ADD VALUE IF NOT EXISTS 'entregado';`
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Para revertir, se recreará el enum sin los valores "por_entregar" y "entregado"
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Actualizar registros que tengan los nuevos valores para evitar incompatibilidades.
      await queryInterface.sequelize.query(
        `UPDATE "ordenes_servicio" SET "estado" = 'pendiente' WHERE "estado" IN ('por_entregar', 'entregado');`,
        { transaction }
      );

      // Crear un nuevo tipo enum con los valores originales.
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_ordenes_servicio_estado_old" AS ENUM('pendiente', 'en_proceso', 'completado', 'cancelado');`,
        { transaction }
      );

      // Cambiar la columna "estado" para que use el nuevo tipo enum creado.
      await queryInterface.changeColumn(
        'ordenes_servicio',
        'estado',
        {
          type: Sequelize.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
          defaultValue: 'pendiente',
          allowNull: false,
        },
        { transaction }
      );

      // Eliminar el tipo enum original (que contiene los 6 valores)
      await queryInterface.sequelize.query(
        `DROP TYPE "enum_ordenes_servicio_estado";`,
        { transaction }
      );

      // Renombrar el tipo enum creado (old) al nombre original
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_ordenes_servicio_estado_old" RENAME TO "enum_ordenes_servicio_estado";`,
        { transaction }
      );
    });
  }
};
