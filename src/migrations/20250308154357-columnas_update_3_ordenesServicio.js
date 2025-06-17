'use strict';

export default{
  up: async (queryInterface, Sequelize) => {
    // Agregamos el campo "tipoServicio" como ENUM con valores 'enTaller' y 'domicilio'
    await queryInterface.addColumn('ordenes_servicio', 'tipoServicio', {
      type: Sequelize.ENUM('enTaller', 'domicilio'),
      defaultValue: 'enTaller',
      allowNull: false
    });

    // Agregamos el campo "direccion" (permite nulos)
    await queryInterface.addColumn('ordenes_servicio', 'direccion', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Agregamos el campo "fechaHoraServicio" (permite nulos)
    await queryInterface.addColumn('ordenes_servicio', 'fechaHoraServicio', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminamos los campos en orden inverso al que fueron agregados
    await queryInterface.removeColumn('ordenes_servicio', 'fechaHoraServicio');
    await queryInterface.removeColumn('ordenes_servicio', 'direccion');
    await queryInterface.removeColumn('ordenes_servicio', 'tipoServicio');

    // Dependiendo de la base de datos, puede ser necesario eliminar el tipo ENUM manualmente (por ejemplo, en PostgreSQL)
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ordenes_servicio_tipoServicio";');
  }
};
