const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors'); // Importar el middleware cors
const VentaRoutes = require('./Routes/Venta');
const ClienteRoutes = require('./Routes/Cliente');
const UsuarioRoutes = require('./Routes/Usuario');
const TipoCreditoRoutes = require('./Routes/TipoCredito');
const TipoInteresRoutes = require('./Routes/TipoInteres');
const EmpresaRoutes = require('./Routes/Empresa');
const CuotaRoutes = require('./Routes/Cuota');
const CuentaCorriente = require('./Routes/CuentaCorriente');

const app = express();
const port = process.env.PORT || 3001;

// Conexión a la base de datos
// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1:27017/finanzas') //finanzas-ivana
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));


// Monitorear el estado de la conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose está conectado');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose tuvo un error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose está desconectado');
});

// Middleware
app.use(cors()); // Habilitar cors
app.use(bodyParser.json());
app.use(morgan('dev')); // Integrar Morgan para el registro de solicitudes

// Rutas
app.use('/ventas', VentaRoutes);
app.use('/clientes', ClienteRoutes);
app.use('/usuarios', UsuarioRoutes);
app.use('/tipocreditos', TipoCreditoRoutes);
app.use('/tipointereses', TipoInteresRoutes);
app.use('/empresas', EmpresaRoutes);
app.use('/cuotas', CuotaRoutes);
app.use('/cuentacorriente', CuentaCorriente);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciando el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
