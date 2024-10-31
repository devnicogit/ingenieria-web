const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');


router.post('/register', userController.register);
router.post('/login', userController.login);

// Ruta para obtener todos los usuarios
router.get('/users', userController.getAllUsers);

// Ruta de suscripción al plan
router.post('/subscribe', authenticateToken, userController.subscribe);

router.get('/me', authenticateToken, userController.getUserData);

router.get('/:userId', authenticateToken, userController.getUserData);

router.get('/', authenticateToken, userController.getAllUsers);


// Endpoint para obtener los cursos en los que el usuario está inscrito
router.get('/:id/courses', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId, {
            include: {
                model: Course,
                through: { attributes: [] } // Esto evita que se muestren datos de la tabla intermedia
            }
        });

        if (user) {
            res.json(user.Courses);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener los cursos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
});


module.exports = router;
