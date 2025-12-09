// backend/api/controllers/loginController.js
const UsuarioModel = require('../models/UsuarioModel');
const bcrypt = require('bcrypt');

const loginController = {
    iniciarSesion: async (req, res) => {
        // Recibimos los datos del Frontend
        const { tipo_registro, idInstitucional, contrasena } = req.body;

        // Validación básica
        if (!tipo_registro || !idInstitucional || !contrasena) {
            return res.status(400).json({ message: 'Faltan datos obligatorios.' });
        }

        try {
            let usuarioEncontrado = null;

            // 1. Decidimos qué método del MODELO usar según el tipo de usuario
            if (tipo_registro === 'alumno' || tipo_registro === 'profesor') {
                // Si es alumno/profe, buscamos por ID
                usuarioEncontrado = await UsuarioModel.findByIdInstitucional(idInstitucional);
            } else {
                // Si es admin/invitado, buscamos por Correo (asumiendo que idInstitucional trae el correo)
                usuarioEncontrado = await UsuarioModel.findByEmail(idInstitucional);
            }

            // 2. Verificamos si el usuario existe
            if (!usuarioEncontrado) {
                return res.status(404).json({ message: 'Usuario no encontrado o credenciales incorrectas.' });
            }

            // 3. Verificamos que el tipo de registro coincida (Seguridad extra)
            if (usuarioEncontrado.tipo_registro !== tipo_registro) {
                return res.status(401).json({ message: 'El tipo de usuario no coincide.' });
            }

            // 4. Comparamos la contraseña con bcrypt
            const passwordValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
            
            if (!passwordValida) {
                return res.status(401).json({ message: 'Contraseña incorrecta.' });
            }

            // 5. ¡Éxito! Respondemos al Frontend
            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                user: {
                    id: usuarioEncontrado.id,
                    id_institucional: usuarioEncontrado.id_institucional,
                    nombre: usuarioEncontrado.nombre,
                    tipo: usuarioEncontrado.tipo_registro
                }
            });
            

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

module.exports = loginController;