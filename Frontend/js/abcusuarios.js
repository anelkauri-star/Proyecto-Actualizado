const API_BASE_URL = 'http://localhost:3000/api/usuarios';

// Mapeo: Relaciona el tipo de usuario con el ID de la tabla en el HTML
// AHORA SÍ FUNCIONARÁ PORQUE YA PUSISTE LOS IDs EN EL HTML
const tableBodyMap = {
    'personal': document.getElementById('tbody-personal'),
    'alumno': document.getElementById('tbody-alumno'),
    'invitado': document.getElementById('tbody-invitado'),
    'profesor': document.getElementById('tbody-profesor')
};

// --- 1. CARGAR USUARIOS ---
async function loadUsers() {
    try {
        const response = await fetch(API_BASE_URL); // GET /api/usuarios
        const result = await response.json();

        if (result.success) {
            const data = result.data; // { alumno: [], profesor: [], ... }
            
            // Limpiamos todas las tablas primero
            // (Como usamos getElementById arriba, necesitamos refrescar las referencias si el DOM cambió, 
            // pero lo más seguro es buscarlos aquí directo)
            document.getElementById('tbody-personal').innerHTML = '';
            document.getElementById('tbody-alumno').innerHTML = '';
            document.getElementById('tbody-invitado').innerHTML = '';
            document.getElementById('tbody-profesor').innerHTML = '';

            // Recorremos los datos que llegaron
            for (const [tipo, usuarios] of Object.entries(data)) {
                
                // Si el usuario es 'administrador', lo mandamos a la tabla de 'personal'
                let targetId = 'tbody-' + tipo;
                if (tipo === 'administrador') targetId = 'tbody-personal';

                const tbody = document.getElementById(targetId);

                if (tbody) {
                    usuarios.forEach(u => {
                        tbody.innerHTML += renderUserRow(u);
                    });
                }
            }
        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// --- 2. GENERAR FILA HTML ---
function renderUserRow(user) {
    const matricula = user.id_institucional || 'N/A';
    
    let rowHtml = `<tr>
        <td>${matricula}</td>
        <td>${user.nombre} ${user.apellido_paterno || ''}</td>
        <td>${user.correo}</td>`;

    // Columnas dinámicas según el tipo
    if (user.tipo_registro === 'alumno') {
        rowHtml += `<td>${user.carrera || '-'}</td>
                    <td>${user.semestre || '-'}</td>`;
    } else {
        // Para profesores/invitados/personal usamos las columnas extras como genéricas
        rowHtml += `<td colspan="2">${user.carrera || user.tipo_registro}</td>`; 
    }
    
    // Botones de acción REALES
    // Fíjate que el botón Eliminar llama a handleDelete con el ID real
    rowHtml += `<td class="actions-column">
                    <a href="#" class="delete-button" onclick="handleDelete(${user.id}, '${user.nombre}')">Eliminar</a>
                </td>
            </tr>`;
    return rowHtml;
}

// --- 3. ELIMINAR USUARIO (AHORA SÍ FUNCIONA) ---
window.handleDelete = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            alert('Usuario eliminado correctamente.');
            loadUsers(); // Recargamos la lista para que desaparezca
        } else {
            alert('Error al eliminar: ' + result.message);
        }
    } catch (error) {
        alert('Error de conexión al eliminar');
        console.error(error);
    }
};

// --- 4. AGREGAR USUARIO (Formulario) ---
async function handleAddUser(e) {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const newUser = {};
    formData.forEach((value, key) => newUser[key] = value);

    try {
        // OJO: La ruta para agregar admin es /api/usuarios/admin
        const response = await fetch(`${API_BASE_URL}/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser) 
        });

        const result = await response.json(); 

        if (result.success) {
            alert(`Usuario agregado.\nContraseña temporal: 123456`);
            e.target.reset(); 
            loadUsers(); // Recargar tablas
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert('Error de conexión.');
        console.error(error);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container form'); 
    if (form) form.addEventListener('submit', handleAddUser);
    
    loadUsers(); 
});