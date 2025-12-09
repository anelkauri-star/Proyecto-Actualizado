// frontend/js/bienvenida.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si hay sesión
    const usuarioString = localStorage.getItem('usuarioLogueado');

    if (!usuarioString) {
        alert('No has iniciado sesión.');
        // 🛑 Corrección: Usamos el nombre exacto de tu archivo
        window.location.href = 'Inicio de sesion.html'; 
        return;
    }

    try {
        const usuario = JSON.parse(usuarioString);
        
        // 2. Mostrar el nombre en el HTML
        const nombreSpan = document.getElementById('nombreUsuario');
        if (nombreSpan) {
            // Muestra: "Bienvenido Juan Pablo"
            // Si quieres nombre + apellido: `${usuario.nombre} ${usuario.apellido_paterno}`
            nombreSpan.textContent = usuario.nombre; 
        }

    } catch (e) {
        console.error('Error de sesión:', e);
        localStorage.removeItem('usuarioLogueado');
        window.location.href = 'Inicio de sesion.html';
    }
});