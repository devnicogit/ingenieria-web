const User = require('./models/User');
const Course = require('./models/Course');
const defineAssociations = require('./models/associations');


const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authenticateToken = require('./middleware/authMiddleware');


const app = express();
app.use(express.json()); 

// Servir archivos estáticos
app.use(cors({
  origin: '*',  // Permitir solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos desde el directorio frontend/public
app.use(express.static(path.join(__dirname, '../frontend/public')));


// Ruta para servir la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

 

// Rutas de API
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Ruta para verificar el token sin enviar HTML
app.get('/api/users/verify', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token válido' });
});


// Ruta protegida para el dashboard
app.get('/dashboard', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/dashboard.html'));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Sincronizar la base de datos
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos sincronizada');
}).catch((err) => {
  console.error('Error al sincronizar la base de datos:', err);
});


// Define las asociaciones
defineAssociations();

