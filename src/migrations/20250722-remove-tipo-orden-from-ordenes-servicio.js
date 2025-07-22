'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    // Eliminar el campo tipo_orden de la tabla ordenes_servicio
    return queryInterface.removeColumn("ordenes_servicio", "tipo_orden");
  },

  down: async (queryInterface, Sequelize) => {
    // Volver a agregar el campo tipo_orden si se revierte la migración
    return queryInterface.addColumn("ordenes_servicio", "tipo_orden", {
      type: Sequelize.ENUM("reparacion", "venta"),
      allowNull: true,
      defaultValue: null
    });
  }
};
