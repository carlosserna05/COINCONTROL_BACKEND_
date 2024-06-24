const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/Usuario');

// Ruta para crear un nuevo usuario
router.post('/', usuarioController.crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para actualizar un usuario por su ID
router.put('/:id', usuarioController.actualizarUsuario);

// Ruta para eliminar un usuario por su ID
router.delete('/:id', usuarioController.eliminarUsuario);

router.post('/login', usuarioController.verificarLogin);

router.get('/empresa/:empresaID', usuarioController.obtenerUsuariosPorEmpresa);

module.exports = router;
