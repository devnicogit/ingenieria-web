document.addEventListener('DOMContentLoaded', () => {

  // Mostrar y ocultar el sidebar de login y registro
  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Acceder button clicked"); // Mensaje de depuración
    document.getElementById('login-sidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('register-section').style.display = 'none';
  });

  // Mostrar el formulario de registro en el sidebar
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
  });

  // Cerrar el sidebar de login y registro
  document.getElementById('close-sidebar').addEventListener('click', () => {
    document.getElementById('login-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
  });

  // Cerrar el sidebar de login y registro al hacer clic en el overlay
  document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('login-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
  });

  // Función para el registro
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const birthDate = document.getElementById('birthDate').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, birthDate, phone, address })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Error durante el registro');
        return;
      }

      const data = await response.json();
      if (data.message) {
        alert('Registro exitoso');
        document.getElementById('registerForm').reset();
        document.getElementById('show-login').click();
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      alert('Hubo un problema con el servidor.');
    }
  });

  // Función para el login
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Error en el inicio de sesión');
        return;
      }

      const data = await response.json();
      if (data.token && data.userId && data.role) {  
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId); 
          localStorage.setItem('role', data.role); 
          
          // Redirige al dashboard después del login
          window.location.href = '/dashboard.html';
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Hubo un problema con el servidor.');
    }
  });

  // Función para cerrar sesión
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }

  // Función para verificar autenticación y proteger el dashboard
  async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'index.html';
      return;
    }

    try {
      const response = await fetch('/api/users/verify', { 
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
          window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      window.location.href = 'index.html';
    }
  }

  if (window.location.pathname === '/dashboard') {
    checkAuth();
  }

    // Variables para el carrito y contador de artículos
    const cart = [];
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const paymentMethods = document.getElementById('payment-methods');
  
    // Funcionalidad de agregar cursos al carrito
    document.querySelectorAll('.select-plan, .add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const plan = e.target.closest('.plan');
        const courseName = plan ? plan.dataset.plan : 'Curso';
        const price = plan ? parseInt(plan.dataset.price, 10) : 100;
  
        cart.push({ courseName, price });
        updateCart();
      });
    });
  
    // Actualizar carrito
    function updateCart() {
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.courseName} - ${item.price} soles`;
        cartItems.appendChild(itemDiv);
        total += item.price;
      });
      cartTotal.textContent = total;
      cartCount.textContent = cart.length;
    }
  

});
