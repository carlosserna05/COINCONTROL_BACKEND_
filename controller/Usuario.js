const Usuario = require('../model/Usuario');

/**
 * Controlador para la creación de un nuevo usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    if (error.code === 11000) {
      // 11000 is the code for duplicate key error in MongoDB
      res.status(400).json({ mensaje: 'El nombre de usuario ya existe. Por favor elige otro.' });
    } else {
      res.status(400).json({ mensaje: error.message });
    }
  }
};

/**
 * Controlador para obtener todos los usuarios
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para obtener un usuario por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para actualizar un usuario por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para eliminar un usuario por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Añadir esta función en tu controlador de Usuario (UsuarioController.js)
exports.verificarLogin = async (req, res) => {
  const { user, pass } = req.body;
  try {
    const usuario = await Usuario.findOne({ user, pass });
    if (!usuario) {
      return res.status(401).json({ success: false, mensaje: 'Usuario o contraseña incorrectos' });
    }
    res.status(200).json({ success: true, mensaje: 'Login exitoso',usuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para obtener todos los usuarios de una empresa por su Empresa_id
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerUsuariosPorEmpresa = async (req, res) => {
  try {
    const { empresaID } = req.params;
    const usuarios = await Usuario.find({ Empresa_id: empresaID });
    if (usuarios.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron usuarios para esta empresa' });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
