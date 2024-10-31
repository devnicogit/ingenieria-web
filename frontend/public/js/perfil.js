// frontend/public/js/perfil.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        window.location.href = 'index.html';
        return;
    }

    await loadUserProfile(userId);
    await loadEnrolledCourses(userId);
});

async function loadUserProfile(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            const user = await response.json();
            document.getElementById('username').textContent = user.username;
            document.getElementById('plan').textContent = user.plan;
            document.getElementById('phone').textContent = user.phone || 'No disponible';
            document.getElementById('address').textContent = user.address || 'No disponible';
            document.getElementById('birthdate').textContent = user.birthDate || 'No disponible';
        } else {
            console.error('Error al cargar el perfil del usuario');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

async function loadEnrolledCourses(userId) {
    try {
        const response = await fetch(`/api/users/${userId}/courses`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            const courses = await response.json();
            displayEnrolledCourses(courses);
        } else {
            console.error('Error al obtener los cursos inscritos');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

function displayEnrolledCourses(courses) {
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = ''; // Limpiar contenido anterior

    if (courses.length === 0) {
        coursesContainer.textContent = 'No estás inscrito en ningún curso';
        return;
    }

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p><strong>Progreso:</strong> ${course.progress}%</p>
        `;
        coursesContainer.appendChild(courseCard);
    });
}
  