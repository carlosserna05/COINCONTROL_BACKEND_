const TipoInteres = require('../model/TipoInteres');

/**
 * Controlador para la creación de un nuevo tipo de interés
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.crearTipoInteres = async (req, res) => {
  try {
    const nuevoTipoInteres = new TipoInteres(req.body);
    const tipoInteresGuardado = await nuevoTipoInteres.save();
    res.status(201).json(tipoInteresGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Controlador para obtener todos los tipos de interés
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerTiposInteres = async (req, res) => {
  try {
    const tiposInteres = await TipoInteres.find();
    res.status(200).json(tiposInteres);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para obtener un tipo de interés por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerTipoInteresPorId = async (req, res) => {
  try {
    const tipoInteres = await TipoInteres.findById(req.params.id);
    if (!tipoInteres) {
      return res.status(404).json({ mensaje: 'Tipo de interés no encontrado' });
    }
    res.status(200).json(tipoInteres);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para actualizar un tipo de interés por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.actualizarTipoInteres = async (req, res) => {
  try {
    const tipoInteresActualizado = await TipoInteres.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tipoInteresActualizado) {
      return res.status(404).json({ mensaje: 'Tipo de interés no encontrado' });
    }
    res.status(200).json(tipoInteresActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para eliminar un tipo de interés por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.eliminarTipoInteres = async (req, res) => {
  try {
    const tipoInteresEliminado = await TipoInteres.findByIdAndDelete(req.params.id);
    if (!tipoInteresEliminado) {
      return res.status(404).json({ mensaje: 'Tipo de interés no encontrado' });
    }
    res.status(200).json({ mensaje: 'Tipo de interés eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
