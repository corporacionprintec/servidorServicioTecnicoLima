'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Eliminar el valor predeterminado
    await queryInterface.changeColumn('ordenes_servicio', 'estado', {
      type: Sequelize.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
      allowNull: false
    });

    // Cambiar el tipo ENUM añadiendo los nuevos valores
    await queryInterface.changeColumn('ordenes_servicio', 'estado', {
      type: Sequelize.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado', 'por_entregar', 'entregado'),
      defaultValue: 'pendiente',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir a la versión anterior sin los nuevos valores
    await queryInterface.changeColumn('ordenes_servicio', 'estado', {
      type: Sequelize.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
      defaultValue: 'pendiente',
      allowNull: false
    });
  }
};
