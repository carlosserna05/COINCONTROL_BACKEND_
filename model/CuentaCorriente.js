const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para la cuenta corriente
const CuentaCorrienteSchema = new Schema({
  empresa_id: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true }, // Referencia al cliente
  saldo: { type: Number, default: 0 }, // Saldo de la cuenta corriente
  transacciones: [{ type: Schema.Types.ObjectId, ref: 'Transaccion' }] // Referencias a las transacciones asociadas
});

// Crea el modelo de cuenta corriente y asigna el esquema
const CuentaCorriente = mongoose.model('CuentaCorriente', CuentaCorrienteSchema);

module.exports = CuentaCorriente;
