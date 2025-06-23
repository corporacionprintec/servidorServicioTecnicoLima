'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    // Postgres: ALTER TYPE ... ADD VALUE
    // MySQL: ALTER TABLE ... MODIFY COLUMN ...
    // Aquí se asume Postgres. Si usas MySQL, avísame para ajustar.
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_ordenes_servicio_estado') THEN
          CREATE TYPE enum_ordenes_servicio_estado AS ENUM ('pendiente', 'en_proceso', 'acudiendo', 'atentido', 'completado', 'por_entregar', 'entregado', 'cancelado', 'venta_rapida');
        ELSIF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'venta_rapida' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_ordenes_servicio_estado')) THEN
          ALTER TYPE "enum_ordenes_servicio_estado" ADD VALUE 'venta_rapida';
        END IF;
      END$$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // No se puede eliminar un valor ENUM en Postgres fácilmente, pero se puede recrear el tipo
    // con los valores originales si es necesario.
    // Aquí se muestra cómo hacerlo, pero requiere que no haya registros con 'venta_rapida'.
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'venta_rapida' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_ordenes_servicio_estado')) THEN
          -- Cambiar temporalmente los registros con 'venta_rapida' a 'pendiente'
          UPDATE "ordenes_servicio" SET "estado" = 'pendiente' WHERE "estado" = 'venta_rapida';
          -- Crear nuevo tipo ENUM sin 'venta_rapida'
          CREATE TYPE enum_ordenes_servicio_estado_new AS ENUM ('pendiente', 'en_proceso', 'acudiendo', 'atentido', 'completado', 'por_entregar', 'entregado', 'cancelado');
          -- Cambiar la columna a nuevo tipo
          ALTER TABLE "ordenes_servicio" ALTER COLUMN "estado" TYPE enum_ordenes_servicio_estado_new USING estado::text::enum_ordenes_servicio_estado_new;
          -- Borrar el tipo viejo y renombrar el nuevo
          DROP TYPE "enum_ordenes_servicio_estado";
          ALTER TYPE enum_ordenes_servicio_estado_new RENAME TO enum_ordenes_servicio_estado;
        END IF;
      END$$;
    `);
  }
};
