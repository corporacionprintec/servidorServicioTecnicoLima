

import { Dispositivo } from '../models/index.js';

export const updateDispositivo = async (req, res) => {


  try {
    const { id } = req.params;
    const { tipo_dispositivo, modelo, marca, dni_tecnico } = req.body;

    // Buscar el dispositivo por su ID
    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      console.log(`No se encontró dispositivo con id: ${id}`);
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }

    // Actualizar únicamente los campos especificados
    if (tipo_dispositivo !== undefined) dispositivo.tipo_dispositivo = tipo_dispositivo;
    if (modelo !== undefined) dispositivo.modelo = modelo;
    if (marca !== undefined) dispositivo.marca = marca;

    // Guardar solo el DNI en "detalles"
    if (dni_tecnico !== undefined) {
      dispositivo.detalles = dni_tecnico;
    }

    // Guardar los cambios en la base de datos
    await dispositivo.save();

    console.log('Dispositivo actualizado correctamente:', dispositivo);
    return res.status(200).json({
      message: "Dispositivo actualizado correctamente",
      dispositivo
    });
  } catch (error) {
    console.error('Error en updateDispositivo:', error);
    return res.status(500).json({
      message: "Error actualizando el dispositivo",
      error: error.message
    });
  }
};
