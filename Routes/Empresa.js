const express = require('express');
const router = express.Router();
const empresaController = require('../controller/Empresa');

// Ruta para crear una nueva empresa
router.post('/', empresaController.crearEmpresa);

// Ruta para obtener todas las empresas
router.get('/', empresaController.obtenerEmpresas);

// Ruta para obtener una empresa por su ID
router.get('/:id', empresaController.obtenerEmpresaPorId);

// Ruta para actualizar una empresa por su ID
router.put('/:id', empresaController.actualizarEmpresa);

// Ruta para eliminar una empresa por su ID
router.delete('/:id', empresaController.eliminarEmpresa);

module.exports = router;
