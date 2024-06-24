const express = require('express');
const router = express.Router();
const tipoInteresController = require('../controller/TipoInteres');

// Ruta para crear un nuevo tipo de interés
router.post('/', tipoInteresController.crearTipoInteres);

// Ruta para obtener todos los tipos de interés
router.get('/', tipoInteresController.obtenerTiposInteres);

// Ruta para obtener un tipo de interés por su ID
router.get('/:id', tipoInteresController.obtenerTipoInteresPorId);

// Ruta para actualizar un tipo de interés por su ID
router.put('/:id', tipoInteresController.actualizarTipoInteres);

// Ruta para eliminar un tipo de interés por su ID
router.delete('/:id', tipoInteresController.eliminarTipoInteres);

module.exports = router;
