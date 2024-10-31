document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan');
    const dynamicPlanSection = document.getElementById('dynamic-plan-section');
    const authSection = document.querySelector('.auth-section');
    const paymentSection = document.getElementById('payment-section');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    const loadingAnimation = document.getElementById('loading-animation');
    const successAnimation = document.getElementById('success-animation');
    loadingAnimation.style.display = 'none';
    successAnimation.style.display = 'none';

    const planData = {
        basic: {
            title: 'Plan Básico',
            annualPrice: 'S/ 200/año',
            monthlyPrice: 'S/ 17',
            benefits: [
                'Acceso a cursos básicos',
                'Soporte en línea limitado',
                'Certificado digital al completar cursos'
            ]
        },
        expert: {
            title: 'Plan Expert',
            annualPrice: 'S/ 350/año',
            monthlyPrice: 'S/ 30',
            benefits: [
                'Acceso a todos los cursos avanzados',
                'Soporte en línea 24/7',
                'Certificados físicos al completar rutas de perfil'
            ]
        },
        expertduo: {
            title: 'Plan Expert Duo',
            annualPrice: 'S/ 500/año',
            monthlyPrice: 'S/ 42',
            benefits: [
                'Eventos exclusivos como Platzi Conf',
                'Más de 1500 cursos y 17 escuelas',
                'Certificados digitales y físicos',
                'Acceso a la English Academy, Escuela de Startups, Liderazgo y Management'
            ]
        }
    };

    const selectedPlanData = planData[selectedPlan] || planData['basic'];

    // Genera el contenido dinámico del plan
    dynamicPlanSection.innerHTML = `
        <h2>${selectedPlanData.title}</h2>
        <p>Pago anual con renovación automática cada año</p>
        <p>Total a pagar: ${selectedPlanData.annualPrice}</p>
        <p>Precio por mes: ${selectedPlanData.monthlyPrice}</p>
        <ul>
            ${selectedPlanData.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
    `;

    // Oculta la sección de pago inicialmente
    paymentSection.style.display = 'none';

    // Maneja el formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Guarda el token

                // Oculta la sección de autenticación y muestra la sección de pago y el plan
                authSection.style.display = 'none';
                paymentSection.style.display = 'block';
                dynamicPlanSection.style.display = 'block';

                console.log("Inicio de sesión exitoso, mostrando formulario de pago y plan.");
            } else {
                alert('Error de autenticación');
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
        }
    });

    // Maneja el formulario de registro
    registerForm.addEventListener('submit', async (e) => {
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

            if (response.ok) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
            } else {
                alert('Error durante el registro');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
        }
    });

    // Mostrar el formulario de registro y ocultar el de login
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    // Mostrar el formulario de login y ocultar el de registro
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Maneja el formulario de pago
    document.getElementById('paymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingAnimation.style.display = 'flex'; // Muestra la animación de carga

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debe iniciar sesión para suscribirse.');
            return;
        }

        try {
            // Simulación de la validación de la tarjeta
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Llama a la API para actualizar el plan del usuario en la base de datos
            const response = await fetch('/api/users/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ plan: selectedPlan })
            });

            loadingAnimation.style.display = 'none'; // Oculta la animación de carga

            if (response.ok) {
                successAnimation.style.display = 'flex'; // Muestra la animación de éxito

                // Redirige al dashboard después de 2 segundos
                setTimeout(() => {
                    successAnimation.style.display = 'none';
                    window.location.href = '/dashboard.html';
                }, 2000);
            } else {
                alert('Error al suscribirse al plan');
            }
        } catch (error) {
            console.error('Error en la suscripción:', error);
            alert('Ocurrió un problema con la suscripción');
            loadingAnimation.style.display = 'none';
        }
    });
});
