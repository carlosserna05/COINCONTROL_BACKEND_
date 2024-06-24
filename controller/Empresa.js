const Empresa = require('../model/Empresa');
const CuentaCorriente = require('../model/CuentaCorriente');
/**
 * Controlador para la creación de una nueva empresa
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */

// Controlador para la creación de una nueva empresa
// Controlador para la creación de una nueva empresa
exports.crearEmpresa = async (req, res) => {
  try {
    // Crear una nueva instancia de Empresa con los datos recibidos en el cuerpo de la solicitud
    const nuevaEmpresa = new Empresa(req.body);
    // Guardar la nueva empresa en la base de datos
    const empresaGuardada = await nuevaEmpresa.save();
    
    // Crear una nueva instancia de CuentaCorriente asociada a la nueva empresa
    const nuevaCuentaCorriente = new CuentaCorriente({ empresa_id: empresaGuardada._id });
    // Guardar la nueva cuenta corriente en la base de datos
    await nuevaCuentaCorriente.save();
    
    // Enviar una respuesta exitosa con la empresa guardada
    res.status(201).json(empresaGuardada);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para obtener todas las empresas
exports.obtenerEmpresas = async (req, res) => {
  try {
    // Buscar todas las empresas en la base de datos
    const empresas = await Empresa.find();
    // Enviar una respuesta exitosa con todas las empresas encontradas
    res.status(200).json(empresas);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener una empresa por su ID
exports.obtenerEmpresaPorId = async (req, res) => {
  try {
    // Buscar una empresa por su ID en la base de datos
    const empresa = await Empresa.findById(req.params.id);
    // Verificar si se encontró la empresa
    if (!empresa) {
      // Si no se encontró, enviar una respuesta indicando que la empresa no fue encontrada
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    // Enviar una respuesta exitosa con la empresa encontrada
    res.status(200).json(empresa);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar una empresa por su ID
exports.actualizarEmpresa = async (req, res) => {
  try {
    // Buscar y actualizar la empresa por su ID utilizando los datos recibidos en el cuerpo de la solicitud
    const empresaActualizada = await Empresa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Verificar si se encontró y actualizó la empresa
    if (!empresaActualizada) {
      // Si no se encontró, enviar una respuesta indicando que la empresa no fue encontrada
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    // Enviar una respuesta exitosa con la empresa actualizada
    res.status(200).json(empresaActualizada);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar una empresa por su ID
exports.eliminarEmpresa = async (req, res) => {
  try {
    // Buscar y eliminar la empresa por su ID
    const empresaEliminada = await Empresa.findByIdAndDelete(req.params.id);
    // Verificar si se encontró y eliminó la empresa
    if (!empresaEliminada) {
      // Si no se encontró, enviar una respuesta indicando que la empresa no fue encontrada
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    // Enviar una respuesta exitosa indicando que la empresa fue eliminada correctamente
    res.status(200).json({ mensaje: 'Empresa eliminada correctamente' });
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};
