const CuentaCorriente = require('../model/CuentaCorriente');

// Controlador para crear una nueva cuenta corriente
exports.crearCuentaCorriente = async (req, res) => {
  try {
    // Crear una nueva instancia de CuentaCorriente con los datos recibidos en el cuerpo de la solicitud
    const nuevaCuentaCorriente = new CuentaCorriente(req.body);
    // Guardar la nueva cuenta corriente en la base de datos
    const cuentaCorrienteGuardada = await nuevaCuentaCorriente.save();
    // Enviar una respuesta exitosa con la cuenta corriente guardada
    res.status(201).json(cuentaCorrienteGuardada);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para obtener todas las cuentas corrientes
exports.obtenerCuentasCorrientes = async (req, res) => {
  try {
    // Buscar todas las cuentas corrientes en la base de datos
    const cuentasCorrientes = await CuentaCorriente.find();
    // Enviar una respuesta exitosa con todas las cuentas corrientes encontradas
    res.status(200).json(cuentasCorrientes);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener una cuenta corriente por su ID
exports.obtenerCuentaCorrientePorId = async (req, res) => {
  try {
    // Buscar una cuenta corriente por su ID en la base de datos
    const cuentaCorriente = await CuentaCorriente.findById(req.params.id);
    // Verificar si se encontró la cuenta corriente
    if (!cuentaCorriente) {
      // Si no se encontró, enviar una respuesta indicando que la cuenta corriente no fue encontrada
      return res.status(404).json({ mensaje: 'Cuenta corriente no encontrada' });
    }
    // Enviar una respuesta exitosa con la cuenta corriente encontrada
    res.status(200).json(cuentaCorriente);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar una cuenta corriente por su ID
exports.actualizarCuentaCorriente = async (req, res) => {
  try {
    // Buscar y actualizar la cuenta corriente por su ID utilizando los datos recibidos en el cuerpo de la solicitud
    const cuentaCorrienteActualizada = await CuentaCorriente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Verificar si se encontró y actualizó la cuenta corriente
    if (!cuentaCorrienteActualizada) {
      // Si no se encontró, enviar una respuesta indicando que la cuenta corriente no fue encontrada
      return res.status(404).json({ mensaje: 'Cuenta corriente no encontrada' });
    }
    // Enviar una respuesta exitosa con la cuenta corriente actualizada
    res.status(200).json(cuentaCorrienteActualizada);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar una cuenta corriente por su ID
exports.eliminarCuentaCorriente = async (req, res) => {
  try {
    // Buscar y eliminar la cuenta corriente por su ID
    const cuentaCorrienteEliminada = await CuentaCorriente.findByIdAndDelete(req.params.id);
    // Verificar si se encontró y eliminó la cuenta corriente
    if (!cuentaCorrienteEliminada) {
      // Si no se encontró, enviar una respuesta indicando que la cuenta corriente no fue encontrada
      return res.status(404).json({ mensaje: 'Cuenta corriente no encontrada' });
    }
    // Enviar una respuesta exitosa indicando que la cuenta corriente fue eliminada correctamente
    res.status(200).json({ mensaje: 'Cuenta corriente eliminada correctamente' });
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: error.message });
  }
};

exports.obtenerCuentaCorrientePorEmpresaId = async (req, res) => {
  try {
    const { empresaId } = req.params;

    // Buscar la cuenta corriente por el empresa_id proporcionado
    const cuentaCorriente = await CuentaCorriente.findOne({ empresa_id: empresaId })
      .populate({
        path: 'transacciones',
        populate: {
          path: 'Cliente_id',
          model: 'Cliente'
        }
      })
      .exec();
 
    // Verificar si se encontró la cuenta corriente
    if (!cuentaCorriente) {
      return res.status(404).json({ mensaje: 'Cuenta corriente no encontrada para este empresa ID' });
    }

    // Calcular el saldo actualizado
    let saldo = 0
    cuentaCorriente.transacciones.forEach(transaccion => {
      if(transaccion.tipo=='ingreso')
        saldo=saldo+transaccion.monto;
      if(transaccion.tipo=='egreso')
        saldo=saldo-transaccion.monto;

    });
    cuentaCorriente.saldo = saldo;

    // Guardar la cuenta corriente con el saldo actualizado
    await cuentaCorriente.save();
    console.log(cuentaCorriente)
    // Enviar la cuenta corriente con el saldo actualizado en la respuesta
    res.status(200).json(cuentaCorriente);
  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema durante el proceso
    res.status(500).json({ mensaje: 'Error al obtener la cuenta corriente', error: error.message });
  }
};
