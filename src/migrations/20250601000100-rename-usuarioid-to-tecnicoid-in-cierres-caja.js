'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Cambiar el nombre del campo usuario_id a tecnico_id en cierres_caja
    await queryInterface.renameColumn('cierres_caja', 'usuario_id', 'tecnico_id');
    // Cambiar la referencia en la columna tecnico_id para que apunte a tecnicos
    await queryInterface.changeColumn('cierres_caja', 'tecnico_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tecnicos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    // Si en pagos hay alguna referencia a usuario_id, aquí podrías agregar la migración
    // Pero en pagos solo se asocia a cierre_caja_id y orden_id, así que no es necesario
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir el cambio de nombre de tecnico_id a usuario_id
    await queryInterface.renameColumn('cierres_caja', 'tecnico_id', 'usuario_id');
    await queryInterface.changeColumn('cierres_caja', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tecnicos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
