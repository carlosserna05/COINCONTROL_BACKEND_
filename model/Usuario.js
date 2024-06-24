const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  user: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  correo: { type: String, required: true },
  Empresa_id: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
});

// Create a unique index on the 'user' field
UsuarioSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
