const express = require('express');
const router = express.Router();
const tipoCreditoController = require('../controller/TipoCredito');

// Ruta para crear un nuevo tipo de crédito
router.post('/', tipoCreditoController.crearTipoCredito);

// Ruta para obtener todos los tipos de crédito
router.get('/', tipoCreditoController.obtenerTiposCredito);

// Ruta para obtener un tipo de crédito por su ID
router.get('/:id', tipoCreditoController.obtenerTipoCreditoPorId);

// Ruta para actualizar un tipo de crédito por su ID
router.put('/:id', tipoCreditoController.actualizarTipoCredito);

// Ruta para eliminar un tipo de crédito por su ID
router.delete('/:id', tipoCreditoController.eliminarTipoCredito);

module.exports = router;
