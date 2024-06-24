const express = require('express');
const router = express.Router();
const clienteController = require('../controller/Cliente');

// Ruta para crear un nuevo cliente
router.post('/', clienteController.crearCliente);

// Ruta para obtener todos los clientes
router.get('/', clienteController.obtenerClientes);

// Ruta para obtener un cliente por su ID
router.get('/:id', clienteController.obtenerClientePorId);

// Ruta para actualizar un cliente por su ID
router.put('/:id', clienteController.actualizarCliente);

// Ruta para eliminar un cliente por su ID
router.delete('/:id', clienteController.eliminarCliente);

// Ruta para obtener todos los clientes por empresa 
router.get('/clientes-por-usuario-empresa/:empresaID', clienteController.getClientesPorEmpresa);

module.exports = router;
