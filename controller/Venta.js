const Usuario = require("../model/Usuario");
const Venta = require("../model/Venta");
const Cuota = require("../model/Cuota");
const CuentaCorriente = require("../model/CuentaCorriente");
const Transaccion = require("../model/Transaccion");
const Cliente = require("../model/Cliente");
const TipoInteres = require("../model/TipoInteres");

/**
 * Controlador para la creación de una nueva venta y sus cuotas
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
/**
 * Controlador para la creación de una nueva venta y sus cuotas
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */


function calcularPago(tasaInteres, cuotas, montoTotal) {
  // Convertir la tasa de interés de porcentaje a decimal
  let tasaDecimal = tasaInteres
  
  if (tasaDecimal === 0) {
    // Si la tasa de interés es 0, el pago periódico es simplemente el monto total dividido por el número de cuotas
    return montoTotal / cuotas;
  } else {
    return montoTotal * (
      (tasaDecimal * Math.pow(1 + tasaDecimal, cuotas)) / 
      (Math.pow(1 + tasaDecimal, cuotas) - 1)
    );
  }
}
exports.createVentaConCuotas = async (req, res) => {
  try {
    const { TipoInteres_id, Cliente_id, tasaInteres,montoTotal, cuotas, plazoGracia, fechaVenta, Usuario_id } = req.body;

    // Buscar al cliente
    const cliente = await Cliente.findById(Cliente_id);
    if (!cliente) {
      return res.status(400).json({ message: "Cliente no encontrado" });
    }

    // Obtener las ventas activas del cliente
    const ventasActivas = await Venta.find({ Cliente_id, estado: true });
    const totalDeudaActiva = ventasActivas.reduce((sum, venta) => sum + venta.montoTotal, 0);

    // Imprimir datos para depuración
/*     console.log("Cliente:", cliente);
    console.log("Ventas Activas:", ventasActivas);
    console.log("Monto Total de Venta:", montoTotal);
    console.log("Total Deuda Activa:", totalDeudaActiva);
    console.log("Límite de Crédito del Cliente:", cliente.limiteCredito); */

    // Convertir montoTotal a número
    const montoTotalNumerico = parseFloat(montoTotal);

    // Verificar si la nueva venta excede el límite de crédito del cliente
    const nuevaDeuda = totalDeudaActiva + montoTotalNumerico;

    if (nuevaDeuda > cliente.limiteCredito) {
      return res.status(400).json({ message: "El monto total de la nueva venta excede el límite de crédito del cliente" });
    }


    const tasa= await TipoInteres.findById(TipoInteres_id);
    console.log(tasa);

    let tasaInteresConvertido=tasaInteres/100;
    if(tasa.nombre=='TNM'){
       tasaInteresConvertido = Math.pow(1 + (tasaInteres/100) / 30, 30) - 1;
    }
    console.log(tasaInteresConvertido)
    let saldoFinanciar =montoTotal;
    if(plazoGracia!=0){
       saldoFinanciar = montoTotal * Math.pow(1 + (tasaInteresConvertido ),plazoGracia);
    }
    console.log(tasaInteresConvertido)
    console.log(montoTotal);
    console.log("SAldo a financiar " +saldoFinanciar);
    let R =calcularPago(tasaInteresConvertido, cuotas, saldoFinanciar);

    const newVenta = new Venta(req.body);
    const savedVenta = await newVenta.save();

    const montoCuota = montoTotalNumerico / cuotas;
    const cuotasArray = [];
    let numeroCuotaTemporal = 0;

    const startDate = new Date(fechaVenta);
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];

    // Crear cuotas para el plazo de gracia con monto 0 y pagado en true
    for (let i = 1; i <= plazoGracia; i++) {
      numeroCuotaTemporal++;
      startDate.setMonth(startDate.getMonth() + 1); // Incrementar un mes
      cuotasArray.push({
        numeroCuota: numeroCuotaTemporal,
        monto: 0,
        pagado: true, // Establecer pagado en true para cuotas con monto 0
        venta_id: savedVenta._id,
        mes: `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`,
      });
    }

    // Crear cuotas restantes con el monto correspondiente y pagado en false
    for (let i = 1; i <= cuotas; i++) {
      numeroCuotaTemporal++;
      startDate.setMonth(startDate.getMonth() + 1); // Incrementar un mes
      cuotasArray.push({
        numeroCuota: numeroCuotaTemporal,
        monto: R,
        pagado: false, // Establecer pagado en false para cuotas con monto distinto de 0
        venta_id: savedVenta._id,
        mes: `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`,
      });
    }

   
    const usuario = await Usuario.findById(req.body.Usuario_id);

    const cuentaCorriente = await CuentaCorriente.findOne({
      empresa_id: usuario.Empresa_id,
    });
   

    // Crear una nueva instancia de Transaccion
    const nuevaTransaccion = new Transaccion({
      cuentaCorriente: cuentaCorriente._id, // Asignar el ID de la cuenta corriente
      tipo: "egreso", // O 'egreso' dependiendo del tipo de transacción
      monto: montoTotalNumerico,
      fecha: new Date(), // Opcional: puedes establecer la fecha de la transacción
      Cliente_id: req.body.Cliente_id,
    });

    // Guardar la transacción en la base de datos
    const transaccionGuardada = await nuevaTransaccion.save();
    // Agregar la transacción al array de transacciones en la cuenta corriente
    cuentaCorriente.transacciones.push(transaccionGuardada._id);

    // Guardar los cambios en la cuenta corriente
    await cuentaCorriente.save();

    const savedCuotas = await Cuota.insertMany(cuotasArray);

    res.status(201).json({
      venta: savedVenta,
      cuotas: savedCuotas,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al crear la venta y sus cuotas", error });
  }
};

/**
 * Controlador para la creación de una nueva venta
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.createVenta = async (req, res) => {
  try {
    const newVenta = new Venta(req.body);
    const savedVenta = await newVenta.save();
    res.status(201).json(savedVenta);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la venta", error });
  }
};

/**
 * Controlador para obtener todas las ventas
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.getVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate("Cliente_id")
      .populate("TipoCredito_id")
      .populate("TipoInteres_id");
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas", error });
  }
};

/**
 * Controlador para obtener una venta por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.getVentaById = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate("Usuario_id")
      .populate("Cliente_id")
      .populate("TipoCredito_id")
      .populate("TipoInteres_id");
    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.status(200).json(venta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la venta", error });
  }
};

/**
 * Controlador para actualizar una venta
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.updateVenta = async (req, res) => {
  try {
    const updatedVenta = await Venta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updatedVenta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.status(200).json(updatedVenta);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la venta", error });
  }
};

/**
 * Controlador para eliminar una venta
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.deleteVenta = async (req, res) => {
  try {
    const deletedVenta = await Venta.findByIdAndDelete(req.params.id);
    if (!deletedVenta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.status(200).json({ message: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la venta", error });
  }
};

exports.getVentasPorEmpresa = async (req, res) => {
  try {
    const userId = req.params.userId;
    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const empresaId = usuario.Empresa_id;
    const todasLasVentas = await Venta.find()
      .populate("Usuario_id")
      .populate("Cliente_id")
      .populate("TipoCredito_id")
      .populate("TipoInteres_id");

    const ventasEmpresa = todasLasVentas.filter((venta) =>
      venta.Usuario_id.Empresa_id.equals(empresaId)
    );

    res.status(200).json(ventasEmpresa);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al obtener las ventas por empresa", error });
  }
};
