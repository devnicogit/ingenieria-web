const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  const { username, password, birthDate, phone, address, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      birthDate,
      phone,
      address,
      role: role || 'user'
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token, userId: user.id, role: user.role });
  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
  }
};

// Suscripción al plan
exports.subscribe = async (req, res) => {
  const { plan } = req.body;
  const userId = req.user.id; // Obtenemos el ID del usuario del token

  if (!plan) {
    return res.status(400).json({ error: 'El plan es obligatorio' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar el plan del usuario
    user.plan = plan;
    await user.save();

    res.json({ message: 'Suscripción al plan actualizada exitosamente' });
  } catch (error) {
    console.error('Error al suscribir el plan:', error);
    res.status(500).json({ error: 'Error en el servidor al suscribir el plan' });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['username', 'plan', 'birthDate', 'phone', 'address'] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      username: user.username,
      plan: user.plan || 'Sin plan', // Muestra 'Sin plan' si el campo está vacío
      birthDate: user.birthDate,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.findAll({
          attributes: ['username', 'role', 'plan', 'phone', 'address'] // Selecciona solo los campos necesarios
      });
      res.json(users);
  } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error en el servidor al obtener usuarios' });
  }
};


