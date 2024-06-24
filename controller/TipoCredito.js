const TipoCredito = require('../model/TipoCredito');

/**
 * Controlador para la creación de un nuevo tipo de crédito
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.crearTipoCredito = async (req, res) => {
  try {
    const nuevoTipoCredito = new TipoCredito(req.body);
    const tipoCreditoGuardado = await nuevoTipoCredito.save();
    res.status(201).json(tipoCreditoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Controlador para obtener todos los tipos de crédito
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerTiposCredito = async (req, res) => {
  try {
    const tiposCredito = await TipoCredito.find();
    res.status(200).json(tiposCredito);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para obtener un tipo de crédito por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerTipoCreditoPorId = async (req, res) => {
  try {
    const tipoCredito = await TipoCredito.findById(req.params.id);
    if (!tipoCredito) {
      return res.status(404).json({ mensaje: 'Tipo de crédito no encontrado' });
    }
    res.status(200).json(tipoCredito);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para actualizar un tipo de crédito por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.actualizarTipoCredito = async (req, res) => {
  try {
    const tipoCreditoActualizado = await TipoCredito.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tipoCreditoActualizado) {
      return res.status(404).json({ mensaje: 'Tipo de crédito no encontrado' });
    }
    res.status(200).json(tipoCreditoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Controlador para eliminar un tipo de crédito por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.eliminarTipoCredito = async (req, res) => {
  try {
    const tipoCreditoEliminado = await TipoCredito.findByIdAndDelete(req.params.id);
    if (!tipoCreditoEliminado) {
      return res.status(404).json({ mensaje: 'Tipo de crédito no encontrado' });
    }
    res.status(200).json({ mensaje: 'Tipo de crédito eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
