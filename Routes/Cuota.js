const express = require('express');
const router = express.Router();
const cuotaController = require('../controller/Cuota');

// Ruta para crear una nueva cuota
router.post('/', cuotaController.crearCuota);

// Ruta para obtener todas las cuotas
router.get('/', cuotaController.obtenerCuotas);

// Ruta para obtener una cuota por su ID
router.get('/:id', cuotaController.obtenerCuotaPorId);

// Ruta para actualizar una cuota por su ID
router.put('/:id', cuotaController.actualizarCuota);

// Ruta para eliminar una cuota por su ID
router.delete('/:id', cuotaController.eliminarCuota);

// Nueva ruta para obtener cuotas por ventaId
router.get('/venta/:ventaId/', cuotaController.obtenerCuotasPorVentaId);

router.put('/pagar/:id', cuotaController.pagarCuota);
  
router.get('/pagos/detalles/:ventaId', cuotaController.obtenerPagosConDetallesPorVentaId);

module.exports = router;
