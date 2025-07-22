'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear columna temporal
    await queryInterface.addColumn("Gastos", "responsable_tmp", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    // 2. Intentar convertir los valores existentes (solo si son numéricos)
    await queryInterface.sequelize.query(`
      UPDATE "Gastos" SET responsable_tmp = NULLIF(regexp_replace(responsable, '[^0-9]', '', 'g'), '')::integer
    `);
    // 3. Eliminar columna original
    await queryInterface.removeColumn("Gastos", "responsable");
    // 4. Renombrar columna temporal
    await queryInterface.renameColumn("Gastos", "responsable_tmp", "responsable");
    // 5. Alterar para not null
    await queryInterface.changeColumn("Gastos", "responsable", {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "ID del técnico responsable"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Gastos", "responsable", {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "Nombre del responsable (antes de migrar a ID)"
    });
  }
};
