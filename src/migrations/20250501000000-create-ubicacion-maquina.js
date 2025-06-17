'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ubicacion_maquina', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      lugar: { 
        type: Sequelize.STRING(100), 
        allowNull: false 
      },
      direccion: { 
        type: Sequelize.TEXT, 
        allowNull: true 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });

    // Agregar datos iniciales
    await queryInterface.bulkInsert('ubicacion_maquina', [
      {
        lugar: 'En Taller M.',
        direccion: 'Dirección del Taller M.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        lugar: 'En Tienda H.',
        direccion: 'Dirección de la Tienda H.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        lugar: 'Trasladado a Taller',
        direccion: 'En proceso de traslado al taller',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        lugar: 'Trasladado a Tienda',
        direccion: 'En proceso de traslado a la tienda',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);


  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la tabla ubicacion_maquina
    await queryInterface.dropTable('ubicacion_maquina');
  }
};