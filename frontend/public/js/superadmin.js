// Función para cambiar de sección en la vista de superadministrador
function showSection(sectionId) {
    const sections = document.querySelectorAll('.superadmin-section');
    sections.forEach(section => {
      section.style.display = section.id === sectionId ? 'block' : 'none';
    });
  }
  
  // Función para cargar estadísticas
  async function loadStats() {
    const response = await fetch('/api/super-admin/stats');
    const stats = await response.json();
  
    document.getElementById('totalAccounts').textContent = stats.totalAccounts;
    document.getElementById('totalRevenue').textContent = stats.totalRevenue;
    document.getElementById('totalPlans').textContent = stats.totalPlans;
  }
  
  // Llamar a las funciones al cargar la página
  document.addEventListener('DOMContentLoaded', loadStats);
  