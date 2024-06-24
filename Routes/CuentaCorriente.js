const express = require('express');
const router = express.Router();
const cuentaCorrienteController = require('../controller/CuentaCorriente');

// Ruta para crear una nueva cuenta corriente
router.post('/', cuentaCorrienteController.crearCuentaCorriente);

// Ruta para obtener todas las cuentas corrientes
router.get('/', cuentaCorrienteController.obtenerCuentasCorrientes);

// Ruta para obtener una cuenta corriente por su ID
router.get('/:id', cuentaCorrienteController.obtenerCuentaCorrientePorId);

// Ruta para actualizar una cuenta corriente por su ID
router.put('/:id', cuentaCorrienteController.actualizarCuentaCorriente);

// Ruta para eliminar una cuenta corriente por su ID
router.delete('/:id', cuentaCorrienteController.eliminarCuentaCorriente);

router.get('/empresa/:empresaId', cuentaCorrienteController.obtenerCuentaCorrientePorEmpresaId);

module.exports = router;
