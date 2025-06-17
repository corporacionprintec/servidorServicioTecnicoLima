'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dispositivos', 'tecnico_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporalmente puede ser nulo
      references: {
        model: 'tecnicos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dispositivos', 'tecnico_id');
  }
};
