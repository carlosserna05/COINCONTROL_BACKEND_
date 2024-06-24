const CuentaCorriente = require("../model/CuentaCorriente");
const Cuota = require("../model/Cuota");
const Pago = require("../model/Pago");
const Transaccion = require("../model/Transaccion");
const Venta = require("../model/Venta");
// Controlador para la creación de una nueva cuota
exports.crearCuota = async (req, res) => {
  try {
    const nuevaCuota = new Cuota(req.body);
    const cuotaGuardada = await nuevaCuota.save();
    res.status(201).json(cuotaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para obtener todas las cuotas
exports.obtenerCuotas = async (req, res) => {
  try {
    const cuotas = await Cuota.find();
    res.status(200).json(cuotas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener una cuota por su ID
exports.obtenerCuotaPorId = async (req, res) => {
  try {
    const cuota = await Cuota.findById(req.params.id);
    if (!cuota) {
      return res.status(404).json({ mensaje: "Cuota no encontrada" });
    }
    res.status(200).json(cuota);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar una cuota por su ID
exports.actualizarCuota = async (req, res) => {
  try {
    const cuotaActualizada = await Cuota.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!cuotaActualizada) {
      return res.status(404).json({ mensaje: "Cuota no encontrada" });
    }
    res.status(200).json(cuotaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar una cuota por su ID
exports.eliminarCuota = async (req, res) => {
  try {
    const cuotaEliminada = await Cuota.findByIdAndDelete(req.params.id);
    if (!cuotaEliminada) {
      return res.status(404).json({ mensaje: "Cuota no encontrada" });
    }
    res.status(200).json({ mensaje: "Cuota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

exports.obtenerCuotasPorVentaId = async (req, res) => {
  try {
    const cuotas = await Cuota.find({ venta_id: req.params.ventaId });
    if (!cuotas.length) {
      return res.status(404).json({ mensaje: "No se encontraron cuotas para esta venta" });
    }

    // Obtener la venta relacionada y el cliente
    const venta = await Venta.findById(req.params.ventaId).populate('Cliente_id');
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    const cliente = venta.Cliente_id;
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const diaPagoCliente = new Date(cliente.fechaPagoMensual).getDate(); // Obtener solo el día de la fecha de pago mensual
    const fechaActual = new Date();

    console.log("Fecha actual:", fechaActual);
    console.log("Día de pago del cliente:", diaPagoCliente);

    const meses = {
      "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3,
      "Mayo": 4, "Junio": 5, "Julio": 6, "Agosto": 7,
      "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
    };

    const cuotasConAtraso = cuotas.map(cuota => {
      // Parsear la fecha de la cuota
      const [mes, año] = cuota.mes.split(' ');

      console.log('mes ' + mes);
      console.log('año ' + año);

      // Convertir mes a número
      const mesNumero = meses[mes];
      if (mesNumero === undefined) {
        console.error(`Mes inválido: ${mes}`);
        return {
          ...cuota._doc,
          diasAtrasado: null,
          montoMora: null,
          mensajeError: `Mes inválido: ${mes}`
        };
      }

      // Crear una fecha límite ajustada con el día de pago del cliente
      const fechaLimite = new Date(año, mesNumero, diaPagoCliente);

      console.log(`Cuota ${cuota.numeroCuota}:`);
      console.log("Mes y año de la cuota:", mes, año);
      console.log("Fecha límite de pago:", fechaLimite);

      // Calcular los días de atraso
      let diasAtraso = 0;
      let montoMora = 0;
      if (fechaActual > fechaLimite && !cuota.pagado) {
        const diferenciaTiempo = fechaActual.getTime() - fechaLimite.getTime();
        diasAtraso = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir milisegundos a días
        montoMora = diasAtraso * (cliente.tasaMoratoria/100) * cuota.monto;
      }

      console.log(fechaActual);
      console.log("Días de atraso:", diasAtraso);
      console.log("Monto de mora:", montoMora);

      // Añadir los días de atraso y monto de mora a la cuota
      return {
        ...cuota._doc,
        diasAtrasado: diasAtraso,
        montoMora: montoMora
      };
    });

    res.status(200).json(cuotasConAtraso);
  } catch (error) {
    console.error("Error al obtener cuotas:", error);
    res.status(500).json({ mensaje: error.message });
  }
};


exports.pagarCuota = async (req, res) => {
  try {
    // Buscar la venta por ID
    const venta = await Venta.findById(req.body.ventaId).populate('Cliente_id');
    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const cliente = venta.Cliente_id;
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Buscar la cuenta corriente de la empresa
    const cuentaCorriente = await CuentaCorriente.findOne({
      empresa_id: req.body.usuarioObject.Empresa_id,
    });
    if (!cuentaCorriente) {
      return res.status(404).json({ message: "Cuenta corriente no encontrada" });
    }

    // Buscar la cuota por ID
    const cuota = await Cuota.findById(req.params.id);
    if (!cuota) {
      return res.status(404).json({ message: "Cuota no encontrada" });
    }

    const diaPagoCliente = new Date(cliente.fechaPagoMensual).getDate();
    const fechaActual = new Date();

    // Parsear la fecha de la cuota
    const meses = {
      "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3,
      "Mayo": 4, "Junio": 5, "Julio": 6, "Agosto": 7,
      "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
    };
    const [mes, año] = cuota.mes.split(' ');
    const mesNumero = meses[mes];
    const fechaLimite = new Date(año, mesNumero, diaPagoCliente);

    let diasAtraso = 0;
    let montoMora = 0;
    if (fechaActual > fechaLimite && !cuota.pagado) {
      const diferenciaTiempo = fechaActual.getTime() - fechaLimite.getTime();
      diasAtraso = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir milisegundos a días
      montoMora = diasAtraso * (cliente.tasaMoratoria / 100) * cuota.monto;
    }

    // Calcular el monto total incluyendo mora
    const montoTotal = cuota.monto + montoMora;

    // Crear una nueva transacción
    const nuevaTransaccion = new Transaccion({
      cuentaCorriente: cuentaCorriente._id, // Asignar el ID de la cuenta corriente
      tipo: "ingreso", // O 'egreso' dependiendo del tipo de transacción
      monto: montoTotal,
      fecha: new Date(), // Opcional: puedes establecer la fecha de la transacción
      Cliente_id: venta.Cliente_id,
    });

    // Guardar la nueva transacción
    const transaccionGuardada = await nuevaTransaccion.save();

    // Agregar la transacción al array de transacciones en la cuenta corriente
    cuentaCorriente.transacciones.push(transaccionGuardada._id);

    // Guardar los cambios en la cuenta corriente
    await cuentaCorriente.save();

    // Marcar la cuota como pagada
    cuota.pagado = true;
    await cuota.save();

    // Crear un nuevo registro de pago
    const pago = new Pago({
      cuota_id: cuota._id,
      monto: montoTotal,
      Cliente_id: venta.Cliente_id,
    });

    // Guardar el registro de pago
    await pago.save();

    // Verificar si todas las cuotas de la venta están pagadas
    const cuotasVenta = await Cuota.find({ venta_id: venta._id });
    const todasCuotasPagadas = cuotasVenta.every(cuota => cuota.pagado);

    if (todasCuotasPagadas) {
      // Cambiar el estado de la venta a false si todas las cuotas están pagadas
      venta.estado = false;
      await venta.save();
    }



    // Enviar respuesta exitosa
    res.json({ message: "Cuota pagada con éxito", cuota, pago, nuevaTransaccion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al pagar la cuota", error });
  }
};


// Controlador para obtener pagos con detalles de una venta específica
exports.obtenerPagosConDetallesPorVentaId = async (req, res) => {
  try {
    const { ventaId } = req.params;

    // Encontrar las cuotas asociadas a la venta especificada
    const cuotas = await Cuota.find({ venta_id: ventaId });

    if (!cuotas.length) {
      return res.status(404).json({ message: "No se encontraron cuotas para esta venta" });
    }

   

    let pagosConDetalles = [];

    // Iterar sobre cada cuota para encontrar los pagos asociados
    for (const cuota of cuotas) {
      const pagos = await Pago.find({ cuota_id: cuota._id }).populate('Cliente_id');
      console.log(pagos);
      if (!pagos.length) {
       
        continue;
      }

      console.log(`Pagos encontrados para la cuota ${cuota._id}:`, pagos);

      pagos.forEach(pago => {
        pagosConDetalles.push({
          cuota_id: pago.cuota_id,
          numeroCuota: cuota.numeroCuota,
          monto: pago.monto,
          fecha: pago.fecha,
          cliente: pago.Cliente_id
        });
      });
    }

    console.log('Pagos con detalles:', pagosConDetalles);

    res.status(200).json(pagosConDetalles);
  } catch (error) {
    console.error('Error al obtener los pagos con detalles:', error);
    res.status(500).json({ message: "Error al obtener los pagos con detalles", error });
  }
};