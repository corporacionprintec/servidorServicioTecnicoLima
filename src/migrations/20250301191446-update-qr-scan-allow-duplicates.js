'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Eliminar todas las posibles restricciones UNIQUE en 'qr_scan'
    await queryInterface.sequelize.query(`
      ALTER TABLE dispositivos 
      DROP CONSTRAINT IF EXISTS dispositivos_qr_scan_key1, 
      DROP CONSTRAINT IF EXISTS dispositivos_qr_scan_key2, 
      DROP CONSTRAINT IF EXISTS dispositivos_qr_scan_key;
    `);

    // Modificar la columna para asegurarse de que no sea UNIQUE
    await queryInterface.changeColumn('dispositivos', 'qr_scan', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Restaurar la restricción UNIQUE si se revierte la migración
    await queryInterface.changeColumn('dispositivos', 'qr_scan', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addConstraint('dispositivos', {
      fields: ['qr_scan'],
      type: 'unique',
      name: 'dispositivos_qr_scan_key'
    });
  }
};
