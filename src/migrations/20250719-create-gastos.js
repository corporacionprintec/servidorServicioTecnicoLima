'use strict';

export default  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Gastos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cantidad: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      responsable: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM("taller", "tienda"),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Gastos");
  },
};
