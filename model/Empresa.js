const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaSchema = new Schema({
    nombre: { type: String, required: true },
    ruc: { type: String, required: true },
});

module.exports = mongoose.model('Empresa', EmpresaSchema,'empresas');