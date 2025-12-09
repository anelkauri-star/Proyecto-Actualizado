// frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    // la etiqueta cambie al cargar la página
    cambiarEtiquetaCredencial(); 
    
    // cambia cada vez que el usuario selecciona una opción diferente
    const userTypeSelect = document.getElementById('user-type');
    if (userTypeSelect) {
        userTypeSelect.addEventListener('change', cambiarEtiquetaCredencial);
    }
});

function cambiarEtiquetaCredencial() {
    const userTypeElement = document.getElementById('user-type');
    if (!userTypeElement) return;

    const userType = userTypeElement.value;
    const labelElement = document.getElementById('credential-label');
    const inputElement = document.getElementById('id-institucional-input'); 

    if (!labelElement || !inputElement) return;
    
    // Si es invitado o administrador, pedimos correo
    if (userType === 'invitado' || userType === 'administrador') {
        labelElement.textContent = 'Ingrese su Correo Electrónico';
        inputElement.type = 'email';
        inputElement.placeholder = 'ej. admin@congreso.com';
    } else {
        // Si es alumno o profesor, se solicita el ID
        labelElement.textContent = 'Ingrese su ID Institucional';
        inputElement.type = 'text';
        inputElement.placeholder = 'ej. 200198';
    }
}

function iniciarSesion(event) {
    event.preventDefault(); // Evita que la página se recargue

    const userType = document.getElementById('user-type').value;
    const credential = document.getElementById('id-institucional-input').value;
    const password = document.getElementById('password-input').value;
    const loginMessage = document.getElementById('loginMessage');
    
    // Limpieza de mensajes
    loginMessage.textContent = '';
    
    const datos = {
        tipo_registro: userType,
        idInstitucional: credential,
        contrasena: password
    };

    fetch('http://localhost:3000/api/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } 
        return response.json().then(errorData => {
            throw new Error(errorData.message || 'Error desconocido.');
        });
    })
    .then(data => {
        // --- ÉXITO ---
        loginMessage.style.color = '#38b000'; 
        loginMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
        
        // se guarda la información del usuario en el navegador
        localStorage.setItem('usuarioLogueado', JSON.stringify(data.user)); 
        
        setTimeout(() => {
            // Verificamos el tipo de usuario que nos devolvió la base de datos
            if (data.user.tipo === 'administrador') {
                console.log("Usuario es admin, yendo al panel...");
                // Redirige al menu admin
                window.location.href = 'menu_admin.html'; 
            } else {
                console.log("Usuario es alumno/profe, yendo al menú normal...");
                // Redirige al menú de alumnos
                window.location.href = 'Menu alumno.html'; 
            }
        }, 800); // Pequeña pausa para que el usuario lea "Éxito"
    })
    .catch(error => {
        // --- ERROR ---
        loginMessage.style.color = '#fff'; 
        loginMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
        loginMessage.style.padding = '5px';
        loginMessage.style.borderRadius = '5px';
        loginMessage.textContent = error.message;
        console.error('Error al iniciar sesión:', error);
    });
}