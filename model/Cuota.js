const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuotaSchema = new Schema({
  numeroCuota: { type: Number, required: true },
  monto: { type: Number, required: true },
  pagado: { type: Boolean, required: true },  // Asegurarse de que el campo pagado es requerido
  venta_id: { type: Schema.Types.ObjectId, ref: 'Venta', required: true },
  mes:{ type: String, required: true },
});

module.exports = mongoose.model('Cuota', CuotaSchema, 'cuotas');
