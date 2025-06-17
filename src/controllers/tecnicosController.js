/**
 * @swagger
 * /api/tecnicos/login:
 *   post:
 *     tags:
 *       - Autenticación de Técnicos
 *     summary: Permite el login de un técnico
 *     description: >
 *       Este endpoint permite a un técnico iniciar sesión utilizando su número de teléfono, contraseña y el rol. 
 *       Si el usuario es administrador, se permite iniciar sesión con rol "tecnico" o "administrador". 
 *       Para otros usuarios, se requiere que el rol proporcionado coincida exactamente con el rol del usuario en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Número de teléfono del técnico.
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del técnico.
 *               role:
 *                 type: string
 *                 description: Rol para iniciar sesión. Si no se especifica, se asume "tecnico".
 *     responses:
 *       200:
 *         description: Login exitoso, retorna la información básica del técnico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     rol:
 *                       type: string
 *       403:
 *         description: El rol proporcionado no es permitido o no corresponde con el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El rol no corresponde
 *       404:
 *         description: Usuario no encontrado o credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error en el servidor
 *                 error:
 *                   type: string
 *                   example: Detalle del error
 */

import tecnicoAuthService from '../services/tecnicoAuthService.js';
import tecnicoService from '../services/tecnicoService.js';

export const loginTecnico = async (req, res) => {
  console.log('==> Llamada al endpoint de login');
  console.log('Body recibido:', req.body);

  try {
    const { login, contrasena, role } = req.body;
    
    // Usar el servicio específico de autenticación
    const userData = await tecnicoAuthService.loginTecnico(login, contrasena, role);

    console.log('Usuario autenticado:', userData);

    return res.status(200).json({
      message: "Login exitoso",
      user: userData
    });

  } catch (error) {
    console.error('Error en loginTecnico:', error);
    
    // Manejar diferentes tipos de errores
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ message: error.message });
    } else if (error.name === 'ValidationError') {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message
    });
  }
};

export const registrarTecnico = async (req, res) => {
  try {
    const { nombre, apellido, telefono, contrasena, rol } = req.body;
    if (!nombre || !apellido || !telefono || !contrasena) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    // Verifica que no exista ya un técnico con ese teléfono
    const existente = await tecnicoService.getAllTecnicos();
    if (existente.find(t => t.telefono === telefono)) {
      return res.status(400).json({ message: 'Ya existe un técnico con ese teléfono' });
    }
    const tecnico = await tecnicoService.createTecnico({ nombre, apellido, telefono, contrasena, rol });
    res.status(201).json({ message: 'Técnico registrado exitosamente', tecnico });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar técnico', error: error.message });
  }
};
