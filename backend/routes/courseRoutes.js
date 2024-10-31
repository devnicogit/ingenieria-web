const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticateToken = require('../middleware/authMiddleware');
const UserCourses = require('../models/UserCourses'); // Importa el modelo UserCourses
const Course = require('../models/Course');
const User = require('../models/User');
const { Op } = require('sequelize'); // Importa Op si estás utilizando operadores

router.get('/', courseController.getCourses);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/search', courseController.searchCourses);

// Obtener todos los cursos o filtrar por búsqueda
router.get('/courses', authenticateToken, async (req, res) => {
    const searchQuery = req.query.search;

    try {
        let courses;
        if (searchQuery) {
            courses = await Course.findAll({
                where: {
                    title: { [Op.iLike]: `%${searchQuery}%` }
                }
            });
        } else {
            courses = await Course.findAll();
        }
        res.json(courses);
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
});

// Ruta para obtener los detalles del curso
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByPk(id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ error: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del curso' });
    }
});

// Ruta para inscribirse en el curso
router.post('/enroll/:id', authenticateToken, async (req, res) => {
    const { id: courseId } = req.params;
    const userId = req.user.id;

    try {
        await UserCourses.create({ userId, courseId });
        res.json({ message: 'Inscripción exitosa' });
    } catch (error) {
        console.error('Error al inscribirse en el curso:', error);
        res.status(500).json({ error: 'Error al inscribirse en el curso' });
    }
});



module.exports = router;
