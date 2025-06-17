'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tabla de clientes
    await queryInterface.createTable('clientes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(50), allowNull: false },
      apellido: { type: Sequelize.STRING(50), allowNull: false },
      telefono: { type: Sequelize.STRING(15), allowNull: false },
      dni: { type: Sequelize.STRING(20)},
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de dispositivos
    await queryInterface.createTable('dispositivos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cliente_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'clientes', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tipo_dispositivo: { type: Sequelize.STRING(50), allowNull: false },
      modelo: { type: Sequelize.STRING(50), allowNull: false },
      numero_serie: { type: Sequelize.STRING(50), unique: true, allowNull: false },
      detalles: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de técnicos
    await queryInterface.createTable('tecnicos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(50), allowNull: false },
      apellido: { type: Sequelize.STRING(50), allowNull: false },
      telefono: { type: Sequelize.STRING(15), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de órdenes de servicio
    await queryInterface.createTable('ordenes_servicio', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      dispositivo_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'dispositivos', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tecnico_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'tecnicos', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      fecha_ingreso: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      problema_descrito: { type: Sequelize.TEXT, allowNull: false },
      estado: { 
        type: Sequelize.STRING(20), 
        defaultValue: 'pendiente',
        allowNull: false 
      },
      costo_acordado: { type: Sequelize.DECIMAL(10,2) },
      fecha_entrega: { type: Sequelize.DATE },
      ticket: { type: Sequelize.STRING(20), unique: true, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de repuestos usados
    await queryInterface.createTable('repuestos_usados', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orden_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'ordenes_servicio', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      repuesto_nombre: { type: Sequelize.STRING(100), allowNull: false },
      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de pagos
    await queryInterface.createTable('pagos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orden_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'ordenes_servicio', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      metodo_pago: { 
        type: Sequelize.STRING(20),
        allowNull: false 
      },
      monto: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      fecha_pago: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de comentarios
    await queryInterface.createTable('comentarios', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orden_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'ordenes_servicio', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      autor: { type: Sequelize.STRING(50), allowNull: false },
      tipo: { 
        type: Sequelize.STRING(10), 
        allowNull: false 
      },
      contenido: { type: Sequelize.TEXT },
      url_audio: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de garantías
    await queryInterface.createTable('garantias', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orden_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'ordenes_servicio', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tiempo_garantia: { type: Sequelize.STRING(50), allowNull: false },
      condiciones: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de usuarios
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(50), allowNull: false },
      telefono: { type: Sequelize.STRING(20), allowNull: false },
      rol: { 
        type: Sequelize.STRING(20), 
        allowNull: false 
      },
      external_id: { type: Sequelize.STRING(255), unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Tabla de accesos anónimos
    await queryInterface.createTable('accesos_anonimos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      ticket: { type: Sequelize.STRING(20), unique: true, allowNull: false },
      fecha: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });


    // Índices simples para búsquedas frecuentes
    await queryInterface.addIndex('dispositivos', ['cliente_id'], {
      name: 'idx_dispositivos_cliente'
    });
    await queryInterface.addIndex('ordenes_servicio', ['estado'], {
      name: 'idx_ordenes_estado'
    });
    await queryInterface.addIndex('ordenes_servicio', ['ticket'], {
      name: 'idx_ordenes_ticket',
      unique: true
    });

    // Índices compuestos para consultas que involucran múltiples campos
    await queryInterface.addIndex('ordenes_servicio', ['dispositivo_id', 'tecnico_id'], {
      name: 'idx_ordenes_dispositivo_tecnico'
    });

    // Índices para relaciones y búsquedas frecuentes
    await queryInterface.addIndex('pagos', ['orden_id'], {
      name: 'idx_pagos_orden'
    });
    await queryInterface.addIndex('comentarios', ['orden_id'], {
      name: 'idx_comentarios_orden'
    });
    await queryInterface.addIndex('garantias', ['orden_id'], {
      name: 'idx_garantias_orden'
    });
    
    // Índices para autenticación y búsqueda de usuarios
    await queryInterface.addIndex('usuarios', ['external_id'], {
      name: 'idx_usuarios_external_id',
      unique: true
    });
    await queryInterface.addIndex('accesos_anonimos', ['ticket'], {
      name: 'idx_accesos_ticket',
      unique: true
    });
  },

  async down(queryInterface) {
    // Eliminar índices
    await queryInterface.removeIndex('dispositivos', 'idx_dispositivos_cliente');
    await queryInterface.removeIndex('ordenes_servicio', 'idx_ordenes_estado');
    await queryInterface.removeIndex('ordenes_servicio', 'idx_ordenes_ticket');
    await queryInterface.removeIndex('ordenes_servicio', 'idx_ordenes_dispositivo_tecnico');
    await queryInterface.removeIndex('pagos', 'idx_pagos_orden');
    await queryInterface.removeIndex('comentarios', 'idx_comentarios_orden');
    await queryInterface.removeIndex('garantias', 'idx_garantias_orden');
    await queryInterface.removeIndex('usuarios', 'idx_usuarios_external_id');
    await queryInterface.removeIndex('accesos_anonimos', 'idx_accesos_ticket');

    // Eliminar tablas
    await queryInterface.dropTable('accesos_anonimos');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('garantias');
    await queryInterface.dropTable('comentarios');
    await queryInterface.dropTable('pagos');
    await queryInterface.dropTable('repuestos_usados');
    await queryInterface.dropTable('ordenes_servicio');
    await queryInterface.dropTable('tecnicos');
    await queryInterface.dropTable('dispositivos');
    await queryInterface.dropTable('clientes');
  }
};
