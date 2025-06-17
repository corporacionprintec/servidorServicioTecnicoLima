/**
 * @swagger
 * /tecnicosAdmin:
 *   get:
 *     tags:
 *       - Gestión de Técnicos
 *     summary: Obtiene la lista de técnicos
 *     description: Este endpoint retorna una lista con todos los técnicos y sus atributos, incluyendo 'rol'.
 *     responses:
 *       200:
 *         description: Lista de técnicos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   telefono:
 *                     type: string
 *                   rol:
 *                     type: string
 *       500:
 *         description: Error al obtener técnicos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener técnicos
 */

/**
 * @swagger
 * /tecnicosAdmin/{id}:
 *   get:
 *     tags:
 *       - Gestión de Técnicos
 *     summary: Obtiene un técnico por su ID
 *     description: Este endpoint retorna los detalles de un técnico específico, incluyendo 'rol'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del técnico a buscar.
 *     responses:
 *       200:
 *         description: Técnico encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 rol:
 *                   type: string
 *       404:
 *         description: Técnico no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Técnico no encontrado
 *       500:
 *         description: Error al obtener el técnico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener el técnico
 */

/**
 * @swagger
 * /tecnicosAdmin:
 *   post:
 *     tags:
 *       - Gestión de Técnicos
 *     summary: Crea un nuevo técnico
 *     description: Este endpoint permite crear un nuevo técnico. Se deben proporcionar los campos 'nombre', 'apellido', 'telefono', 'contrasena' y 'rol'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del técnico
 *               rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Técnico creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 contrasena:
 *                   type: string
 *                 rol:
 *                   type: string
 *       500:
 *         description: Error al crear el técnico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear el técnico
 */

/**
 * @swagger
 * /tecnicosAdmin/{id}:
 *   put:
 *     tags:
 *       - Gestión de Técnicos
 *     summary: Actualiza los datos de un técnico existente
 *     description: Este endpoint permite actualizar los datos de un técnico específico. Se pueden modificar 'nombre', 'apellido', 'telefono', 'contrasena' y 'rol'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del técnico a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *               contrasena:
 *                 type: string
 *                 description: Contraseña nueva del técnico (opcional)
 *               rol:
 *                 type: string
 *     responses:
 *       200:
 *         description: Técnico actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 contrasena:
 *                   type: string
 *                 rol:
 *                   type: string
 *       404:
 *         description: Técnico no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Técnico no encontrado
 *       500:
 *         description: Error al actualizar el técnico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar el técnico
 */

/**
 * @swagger
 * /tecnicosAdmin/{id}:
 *   delete:
 *     tags:
 *       - Gestión de Técnicos
 *     summary: Elimina un técnico existente
 *     description: Este endpoint permite eliminar un técnico específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del técnico a eliminar.
 *     responses:
 *       200:
 *         description: Técnico eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Técnico eliminado exitosamente
 *       404:
 *         description: Técnico no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Técnico no encontrado
 *       500:
 *         description: Error al eliminar el técnico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar el técnico
 */



import { Tecnico } from '../models/index.js';

import tecnicoService from '../services/tecnicoService.js';

const getAllTecnicos = async (req, res) => {
  try {
    const tecnicos = await tecnicoService.getAllTecnicos();
    res.json(tecnicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener técnicos' });
  }
};

const getTecnicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnico = await tecnicoService.getTecnicoById(id);
    res.json(tecnico);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el técnico' });
  }
};

const createTecnico = async (req, res) => {
  try {
    const newTecnico = await tecnicoService.createTecnico(req.body);
    res.status(201).json(newTecnico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el técnico' });
  }
};

const updateTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnico = await tecnicoService.updateTecnico(id, req.body);
    res.json(tecnico);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el técnico' });
  }
};

const deleteTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    await tecnicoService.deleteTecnico(id);
    res.json({ message: 'Técnico eliminado exitosamente' });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el técnico' });
  }
};

export default {
  getAllTecnicos,
  getTecnicoById,
  createTecnico,
  updateTecnico,
  deleteTecnico,
};
