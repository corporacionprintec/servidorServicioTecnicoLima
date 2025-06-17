export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ubicacion_maquina');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ubicacion_maquina', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lugar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  }
};