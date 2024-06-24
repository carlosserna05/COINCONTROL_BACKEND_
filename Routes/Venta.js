const express = require('express');
const router = express.Router();
const ventaController = require('../controller/Venta');

// Rutas CRUD para Ventas
router.post('/', ventaController.createVenta);
router.get('/', ventaController.getVentas);
router.get('/:id', ventaController.getVentaById);
router.put('/:id', ventaController.updateVenta);
router.delete('/:id', ventaController.deleteVenta);

// Nueva ruta para obtener ventas por empresa enviando userID
router.get('/por-empresa/:userId', ventaController.getVentasPorEmpresa);

// Nueva ruta para crear una venta con cuotas
router.post('/concuotas', ventaController.createVentaConCuotas);

module.exports = router;
