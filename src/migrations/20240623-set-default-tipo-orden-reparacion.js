"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    // Cambiar tipo_orden para permitir nulos y eliminar el valor por defecto
    await queryInterface.changeColumn("ordenes_servicio", "tipo_orden", {
      type: Sequelize.ENUM("reparacion", "venta"),
      allowNull: true,
      defaultValue: "reparacion",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir: volver a no permitir nulos y default 'reparacion'
    await queryInterface.changeColumn("ordenes_servicio", "tipo_orden", {
      type: Sequelize.ENUM("reparacion", "venta"),
      allowNull: false,
      defaultValue: "reparacion"
    });
  }
};
