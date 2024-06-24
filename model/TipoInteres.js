const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoInteresSchema = new Schema({
    nombre: { type: String, required: true }
});

module.exports = mongoose.model('TipoInteres', TipoInteresSchema,'tipointereses');
