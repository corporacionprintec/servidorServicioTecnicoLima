'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ordenes_servicio', 'fecha_diagnostico', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('ordenes_servicio', 'fecha_abandono', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('ordenes_servicio', 'fecha_entregado', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ordenes_servicio', 'fecha_diagnostico');
    await queryInterface.removeColumn('ordenes_servicio', 'fecha_abandono');
    await queryInterface.removeColumn('ordenes_servicio', 'fecha_entregado');
  }
};
