'use strict';


export default {
  up: async (queryInterface, Sequelize) => {
    // Paso 1: Agregar la columna sin restricciones
    await queryInterface.addColumn('dispositivos', 'qr_scan', {
      type: Sequelize.STRING,
      allowNull: true // Temporalmente permitimos NULL
    });

    // Paso 2: Asignar valores únicos a los registros existentes
    const dispositivos = await queryInterface.sequelize.query(
      'SELECT id FROM dispositivos;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const dispositivo of dispositivos) {
      await queryInterface.sequelize.query(
        `UPDATE dispositivos SET qr_scan = 'QR-' || :id WHERE id = :id;`,
        { replacements: { id: dispositivo.id } }
      );
    }

    // Paso 3: Modificar la columna para hacerla NOT NULL y UNIQUE
    await queryInterface.changeColumn('dispositivos', 'qr_scan', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dispositivos', 'qr_scan');
  }
};
