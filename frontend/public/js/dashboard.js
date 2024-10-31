// frontend/public/js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      window.location.href = 'index.html';
    }

    // Habilitar el enlace al Panel de Administrador solo si el usuario es admin
    if (role === 'admin') {
        document.getElementById('admin-panel-link').style.display = 'block';
    }

      // Llama a checkAuth al cargar la página para proteger la ruta
      checkAuth();
      const allCourses = await loadAllCourses();
      displayCourses(allCourses);
  
      const searchBar = document.getElementById('search-bar');
      searchBar.addEventListener('input', () => filterCourses(allCourses, searchBar.value));

});


async function loadAllCourses() {
    try {
        const response = await fetch('/api/courses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            return await response.json(); // Devuelve los cursos cargados
        } else {
            console.error('Error al cargar los cursos');
            return []; // Devuelve un array vacío en caso de error
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        return []; // Devuelve un array vacío en caso de excepción
    }
}


// Función para mostrar sugerencias
function showSuggestions(courses) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = '';
    courses.forEach(course => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = course.title;
        suggestionItem.addEventListener('click', () => {
            displayCourses([course]);
            document.getElementById('search-bar').value = course.title;
            suggestionsContainer.innerHTML = '';
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.style.display = courses.length ? 'block' : 'none';
}

// Función para cargar todos los cursos desde la base de datos
async function loadAllCourses() {
    try {
        const response = await fetch('/api/courses', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
            return await response.json(); // Devuelve los cursos cargados
        } else {
            console.error('Error al cargar los cursos');
            return [];
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        return [];
    }
}

// Función para mostrar los cursos en el contenedor
function displayCourses(courses) {
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.innerHTML = `
            <img src="images/default-course.jpg" alt="${course.title}">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <button onclick="window.location.href='course.html?id=${course.id}'">Ver más</button>
        `;
        coursesContainer.appendChild(courseCard);
    });
}


// Función para filtrar cursos en el frontend
function filterCourses(courses, query) {
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase())
    );
    displayCourses(filteredCourses);
    showSuggestions(filteredCourses);
}
// Función para mostrar solo un curso seleccionado
function displaySingleCourse(course) {
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = ''; // Limpia los cursos actuales

    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>Precio:</strong> $${course.price}</p>
        <button onclick="loadAllCourses()">Volver a Todos los Cursos</button>
    `;
    coursesContainer.appendChild(courseCard);
}


document.querySelector('.search-bar').addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
  
    if (query.length < 2) return; // Evitar búsquedas muy cortas
  
    try {
      const response = await fetch(`/api/courses/search?query=${query}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (response.ok) {
        const courses = await response.json();
        displayCourses(courses);
      } else {
        console.error('Error al buscar cursos');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  });
  

function checkAuth() {
    const token = localStorage.getItem('token');

    // Si no hay token, redirige a la página de inicio de sesión
    if (!token) {
        //alert('No estás autenticado');
        window.location.href = 'index.html';
        return;
    }

    // Si hay token, intenta obtener la información del usuario
    fetchUserData();
}

async function fetchUserData() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('No estás autenticado');
      window.location.href = 'index.html';
      return;
    }
  
    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const userData = await response.json();
        
        // Actualiza el nombre y plan en el perfil
        document.querySelector('#profile-name').textContent = userData.username;
        document.querySelector('#profile-greeting').textContent = `Hola ${userData.username}`;
        document.querySelector('#user-plan').textContent = `Plan: ${userData.plan}`;
      } else {
        console.error('Error al obtener la información del usuario');
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error al conectar con el servidor');
    }
  }
  

// Función para cerrar sesión
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Elimina el token de localStorage
        localStorage.removeItem('token');
        
        // Redirige a la página de inicio de sesión
        window.location.href = 'index.html';
    });
}
  