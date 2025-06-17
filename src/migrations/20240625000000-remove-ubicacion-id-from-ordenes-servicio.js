export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ordenes_servicio', 'ubicacion_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ordenes_servicio', 'ubicacion_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ubicacion_maquina',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};