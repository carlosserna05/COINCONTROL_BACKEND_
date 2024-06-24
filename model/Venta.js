const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VentaSchema = new Schema({
    nroVenta: { type: Number, required: true },
    // Campos de VentaSchema
    montoTotal: { type: Number, required: true },
    plazoGracia: { type: Number, required: true },
    Usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaVenta: { type: Date, required: true },

    // Campos de CreditoSchema
    Cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    cuotas:{ type: Number, required: true },
    estado: { type: Boolean, required: true },
/*     FechaInicio: { type: Date, required: true },
    FechaFin: { type: Date, required: true }, */
    TipoCredito_id: { type: Schema.Types.ObjectId, ref: 'TipoCredito', required: true },
    TipoInteres_id: { type: Schema.Types.ObjectId, ref: 'TipoInteres', required: true },
    tasaInteres: { type: Number, required: true },

});

module.exports = mongoose.model('Venta', VentaSchema, 'ventas');
