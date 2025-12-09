// frontend/js/registro.js

// 1. Lógica Visual (Mostrar/Ocultar campos extra)
function cambiarTipoRegistro() {
    const tipo = document.getElementById('tipoRegistro').value;
    const camposAlumno = document.getElementById('camposAlumno');
    const idInput = document.getElementById('idInstitucional');
    const carreraInput = document.getElementById('carrera');
    const semestreInput = document.getElementById('semestre');

    // Reiniciamos requerimientos específicos
    idInput.removeAttribute('required');
    carreraInput.removeAttribute('required');
    semestreInput.removeAttribute('required');

    if (tipo === 'alumno' || tipo === 'profesor') {
        // Mostrar campos de la universidad
        camposAlumno.style.display = 'grid'; 
        idInput.setAttribute('required', 'true');

        // Si es alumno, obligamos carrera y semestre
        if (tipo === 'alumno') {
            carreraInput.setAttribute('required', 'true');
            semestreInput.setAttribute('required', 'true');
        }
    } else {
        // Ocultar campos si es externo/admin
        camposAlumno.style.display = 'none';
    }
}

// 2. Lógica de Envío (Formulario)
function mostrarRegistro() {
    document.getElementById('registroModal').style.display = 'block';
    cambiarTipoRegistro();
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar estado de los campos
    cambiarTipoRegistro();

    const form = document.getElementById('registroForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar recarga

            // Validar contraseñas
            const pass = document.getElementById('contrasena').value;
            const confirmPass = document.getElementById('confirmarContrasena').value;

            if (pass !== confirmPass) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Construir objeto de datos (CAMBIO IMPORTANTE: El correo va siempre)
            const datos = {
                tipo_registro: document.getElementById('tipoRegistro').value,
                nombre: document.getElementById('nombre').value,
                apellido_paterno: document.getElementById('apellidoPaterno').value,
                apellido_materno: document.getElementById('apellidoMaterno').value,
                correo: document.getElementById('correo').value, // 🛑 AHORA SIEMPRE SE ENVÍA
                contrasena: pass,
                
                // Campos opcionales (se envían vacíos si no aplican)
                carrera: document.getElementById('carrera').value || '',
                semestre: document.getElementById('semestre').value || '',
                idInstitucional: document.getElementById('idInstitucional').value || ''
            };

            try {
                const response = await fetch('http://localhost:3000/api/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const result = await response.json();

                if (response.ok && (result.status === 'success' || result.success)) {
                    alert(result.message || "¡Registro exitoso!");
                    document.getElementById('registroModal').style.display = 'none';
                    form.reset();
                } else {
                    alert("Error: " + (result.message || "No se pudo registrar"));
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Error de conexión con el servidor.");
            }
        });
    }
});