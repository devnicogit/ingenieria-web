document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    // Cargar cursos y usuarios
    const courses = await fetchCourses(token);
    const users = await fetchUsers(token);

    // Mostrar cursos y usuarios en tablas
    displayCourses(courses);
    displayUsers(users);
});

async function fetchCourses(token) {
    try {
        const response = await fetch('/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        return [];
    }
}

async function fetchUsers(token) {
    try {
        const response = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        return [];
    }
}

function displayCourses(courses) {
    const coursesTableBody = document.querySelector('#courses-table tbody');
    coursesTableBody.innerHTML = ''; // Limpiar contenido previo

    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.title}</td>
            <td>${course.description}</td>
        `;
        coursesTableBody.appendChild(row);
    });
}

function displayUsers(users) {
    const usersTableBody = document.querySelector('#users-table tbody');
    usersTableBody.innerHTML = ''; // Limpiar contenido previo

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.plan || 'Sin plan'}</td>
            <td>${user.phone || 'No disponible'}</td>
            <td>${user.address || 'No disponible'}</td>
        `;
        usersTableBody.appendChild(row);
    });
}
