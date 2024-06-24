const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para la transacción
const TransaccionSchema = new Schema({
  cuentaCorriente: { type: Schema.Types.ObjectId, ref: 'CuentaCorriente', required: true }, // Referencia a la cuenta corriente
  tipo: { type: String, enum: ['ingreso', 'egreso'], required: true }, // Tipo de transacción (ingreso o egreso)
  monto: { type: Number, required: true }, // Monto de la transacción
  fecha: { type: Date, default: Date.now }, // Fecha de la transacción (por defecto, la fecha actual)
  Cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
});

// Crea el modelo de transacción y asigna el esquema
const Transaccion = mongoose.model('Transaccion', TransaccionSchema);

module.exports = Transaccion;
