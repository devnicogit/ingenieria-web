document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
  
    if (!courseId) {
      alert('ID de curso no proporcionado.');
      return;
    }
  
    try {
      // Obtener los datos del curso
      const courseResponse = await fetch(`/api/courses/${courseId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        displayCourseDetails(courseData);
      } else {
        console.error('Error al obtener los detalles del curso');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  
    // Agregar evento de inscripción
    document.getElementById('enroll-button').addEventListener('click', async () => {
      try {
        const enrollResponse = await fetch(`/api/courses/enroll/${courseId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (enrollResponse.ok) {
          alert('Inscripción exitosa');
        } else {
          alert('Error al inscribirse en el curso');
        }
      } catch (error) {
        console.error('Error en la inscripción:', error);
      }
    });
  });
  
  // Función para mostrar los detalles del curso
  function displayCourseDetails(course) {
    document.getElementById('course-title').textContent = course.title || 'Título del Curso';
    document.getElementById('course-rating').textContent = `⭐ ${course.rating || 0} Opiniones`;
    document.getElementById('course-level').textContent = `Nivel: ${course.level || 'N/A'}`;
    document.getElementById('course-updated').textContent = `Última actualización: ${course.updatedAt || 'N/A'}`;
    document.getElementById('course-icon').src = course.icon || 'images/default-course.jpg';
    document.getElementById('course-syllabus').textContent = course.syllabus || 'Temario no disponible';
  }
  