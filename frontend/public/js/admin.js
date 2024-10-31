// Función para cargar cursos desde el backend
async function loadCourses() {
    const response = await fetch('/api/courses');
    const courses = await response.json();
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
  
    courses.forEach(course => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${course.title}</td>
        <td>${course.description}</td>
        <td>${course.price}</td>
        <td>
          <button onclick="editCourse('${course.id}')">Editar</button>
          <button onclick="deleteCourse('${course.id}')">Eliminar</button>
        </td>
      `;
      courseList.appendChild(row);
    });
  }
  
  // Función para agregar un curso
  document.getElementById('courseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('courseName').value;
    const description = document.getElementById('courseDescription').value;
    const price = document.getElementById('coursePrice').value;
  
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price })
    });
  
    if (response.ok) {
      alert('Curso agregado correctamente');
      loadCourses();
    } else {
      alert('Error al agregar el curso');
    }
  });
  
  // Cargar los cursos al cargar la página
  document.addEventListener('DOMContentLoaded', loadCourses);
  