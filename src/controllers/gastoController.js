
/**
 * @swagger
 * tags:
 *   - name: Gastos
 *     description: Endpoints para gestión de gastos generales
 */

/**
 * @swagger
 * /gastos:
 *   post:
 *     tags: [Gastos]
 *     summary: Crear un nuevo gasto
 *     description: Crea un nuevo gasto en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GastoInput'
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/GastoInput'
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gasto'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   get:
 *     tags: [Gastos]
 *     summary: Listar todos los gastos
 *     description: Retorna todos los gastos registrados o uno por ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID del gasto a buscar
 *     responses:
 *       200:
 *         description: Lista de gastos o gasto por ID
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gasto'
 *                 - $ref: '#/components/schemas/Gasto'
 *       404:
 *         description: Gasto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     tags: [Gastos]
 *     summary: Actualizar un gasto existente
 *     description: Actualiza los datos de un gasto existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GastoInput'
 *     responses:
 *       200:
 *         description: Gasto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gasto'
 *       404:
 *         description: Gasto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /gastos/resumen:
 *   get:
 *     tags: [Gastos]
 *     summary: Resumen de gastos
 *     description: Devuelve el total de gastos y el total por responsable
 *     responses:
 *       200:
 *         description: Resumen de gastos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 porResponsable:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

const Gasto = db.Gasto;

export const crearGasto = async (req, res) => {
  try {
    console.log('Body recibido en crearGasto:', req.body);
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'El body está vacío o malformado. Debe ser un objeto JSON.' });
    }
    const { descripcion, cantidad, responsable, fecha, tipo } = req.body;
    if (!descripcion || !cantidad || responsable === undefined || responsable === null || !fecha || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos en el body.' });
    }
    // responsable debe ser un ID entero
    const responsableId = parseInt(responsable, 10);
    if (isNaN(responsableId)) {
      return res.status(400).json({ error: 'El responsable debe ser un ID numérico de técnico.' });
    }
    const gasto = await Gasto.create({ descripcion, cantidad, responsable: responsableId, fecha, tipo });
    res.status(201).json(gasto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


import db from "../models/index.js";

export const listarGastos = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const gasto = await Gasto.findByPk(id, {
        include: [{ model: db.Tecnico, as: 'tecnico' }]
      });
      if (!gasto) {
        return res.status(404).json({ error: "Gasto no encontrado" });
      }
      // Formatear la respuesta como pide el usuario
      const resp = gasto.tecnico ? {
        id: gasto.tecnico.id,
        nombre: gasto.tecnico.nombre,
        apellido: gasto.tecnico.apellido,
        telefono: gasto.tecnico.telefono,
        rol: gasto.tecnico.rol
      } : null;
      return res.json({
        id: gasto.id,
        descripcion: gasto.descripcion,
        cantidad: gasto.cantidad,
        tipo: gasto.tipo,
        fecha: gasto.fecha,
        responsable: resp
      });
    }
    const gastos = await Gasto.findAll({
      include: [{ model: db.Tecnico, as: 'tecnico' }]
    });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gasto = await Gasto.findByPk(id);
    if (!gasto) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }
    const { descripcion, cantidad, responsable, fecha, tipo } = req.body;
    let responsableId = responsable;
    if (responsable !== undefined && responsable !== null) {
      responsableId = parseInt(responsable, 10);
      if (isNaN(responsableId)) {
        return res.status(400).json({ error: 'El responsable debe ser un ID numérico de técnico.' });
      }
    }
    await gasto.update({ descripcion, cantidad, responsable: responsableId, fecha, tipo });
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resumenGastos = async (req, res) => {
  try {
    // Puedes filtrar por responsable si lo deseas, aquí se asume uno solo
    const { responsable } = req.query;
    let where = {};
    if (responsable) {
      where.responsable = responsable;
    }
    const gastos = await Gasto.findAll({
      where,
      include: [{ model: db.Tecnico, as: 'tecnico' }]
    });
    if (!gastos.length) {
      return res.json({});
    }
    // Si solo hay un gasto, devolver la estructura solicitada
    if (gastos.length === 1) {
      const g = gastos[0];
      const resp = g.tecnico ? {
        id: g.tecnico.id,
        nombre: g.tecnico.nombre,
        apellido: g.tecnico.apellido,
        telefono: g.tecnico.telefono,
        rol: g.tecnico.rol
      } : null;
      return res.json({
        id: g.id,
        descripcion: g.descripcion,
        cantidad: g.cantidad,
        tipo: g.tipo,
        fecha: g.fecha,
        responsable: resp
      });
    }
    // Si hay varios gastos, devolver el resumen agrupado
    const total = gastos.reduce((acc, g) => acc + parseFloat(g.cantidad), 0);
    const tecnico = gastos[0].tecnico;
    const responsableObj = tecnico ? {
      id: tecnico.id,
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      telefono: tecnico.telefono,
      rol: tecnico.rol
    } : null;
    const gastosLimpios = gastos.map(g => ({
      id: g.id,
      descripcion: g.descripcion,
      cantidad: g.cantidad,
      fecha: g.fecha,
      tipo: g.tipo
    }));
    res.json({ total, gastos: gastosLimpios, responsable: responsableObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
