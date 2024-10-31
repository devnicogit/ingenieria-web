const Course = require('../models/Course');

// Obtener todos los cursos
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
};

// Crear un nuevo curso
exports.createCourse = async (req, res) => {
  const { title, description, price, content } = req.body;

  try {
    const newCourse = await Course.create({ title, description, price, content });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el curso' });
  }
};

// Actualizar un curso
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, content } = req.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    await course.update({ title, description, price, content });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el curso' });
  }
};

// Eliminar un curso
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    await course.destroy();
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el curso' });
  }
};

exports.searchCourses = async (req, res) => {
  const query = req.query.query || '';
  try {
    const courses = await Course.findAll({
      where: {
        title: { [Op.iLike]: `%${query}%` }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error('Error en búsqueda de cursos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
