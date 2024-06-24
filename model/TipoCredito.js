const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoCreditoSchema = new Schema({
    nombre: { type: String, required: true },
});

module.exports = mongoose.model('TipoCredito', TipoCreditoSchema,'tipocreditos');
