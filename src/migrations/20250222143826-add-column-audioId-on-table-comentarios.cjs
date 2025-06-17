'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('comentarios', 'audio_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('comentarios', 'autor', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('comentarios', 'audio_id');
    await queryInterface.changeColumn('comentarios', 'autor', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: ''
    });
  }
};
