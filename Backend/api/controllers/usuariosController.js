const UsuarioModel = require('../models/UsuarioModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UsuarioController = {

    // 1. REGISTRAR (Público) - Ya lo tenías
    registrar: async (req, res) => {
        try {
            const { nombre, apellido_paterno, apellido_materno, contrasena, tipo_registro, carrera, semestre, idInstitucional, correo } = req.body;

            const existe = await UsuarioModel.findByEmail(correo);
            if (existe) return res.status(400).json({ status: 'error', message: 'El correo ya está registrado.' });

            const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

            const nuevoUsuario = {
                nombre, apellido_paterno, apellido_materno,
                contrasena: hashedPassword,
                tipo_registro, carrera, semestre, idInstitucional, correo
            };

            const id = await UsuarioModel.create(nuevoUsuario);
            res.status(201).json({ status: 'success', message: 'Registro exitoso', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Error interno.' });
        }
    },

    // 2. LISTAR TODOS LOS USUARIOS (Para el Admin)
    listarTodos: async (req, res) => {
        try {
            const usuarios = await UsuarioModel.getAll();
            // Agrupamos por tipo para facilitar el frontend
            const agrupados = {
                alumno: [],
                profesor: [],
                invitado: [],
                administrador: [],
                personal: [] 
            };
            
            usuarios.forEach(u => {
                const tipo = u.tipo_registro || 'invitado'; // Default
                if (agrupados[tipo]) {
                    agrupados[tipo].push(u);
                }
            });

            res.json({ success: true, data: agrupados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
        }
    },

    // 3. AGREGAR DESDE ADMIN (Panel Admin)
    agregarDesdeAdmin: async (req, res) => {
        try {
            // Recibimos los datos del formulario de ABC humano.html
            const { tipo_usuario, id_usuario, nombre_completo, correo } = req.body;
            const DEFAULT_PASSWORD = 'password123'; // Contraseña por defecto

            // Verificar duplicados (ID o Correo)
            const existeCorreo = await UsuarioModel.findByEmail(correo);
            if (existeCorreo) return res.status(400).json({ success: false, message: 'El correo ya existe.' });
            
            // Si el modelo tiene buscar por ID Institucional, úsalo:
            if(UsuarioModel.findByIdInstitucional) {
                const existeId = await UsuarioModel.findByIdInstitucional(id_usuario);
                if (existeId) return res.status(400).json({ success: false, message: 'El ID/Matrícula ya existe.' });
            }

            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);

            const nuevoUsuario = {
                nombre: nombre_completo,
                apellido_paterno: '', // Admin suele mandar un solo string de nombre
                apellido_materno: '',
                contrasena: hashedPassword,
                tipo_registro: tipo_usuario,
                carrera: null, semestre: null,
                idInstitucional: id_usuario,
                correo: correo
            };

            await UsuarioModel.create(nuevoUsuario);
            res.status(201).json({ success: true, message: 'Usuario agregado correctamente.' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error al guardar usuario.' });
        }
    },

    // 4. ELIMINAR USUARIO (CON LIMPIEZA DE DEPENDENCIAS)
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const { executeQuery } = require('../config/db_config'); 

            // PASO 1: Eliminar primero sus inscripciones (Hijos)
            // Si no hacemos esto, MySQL bloquea el borrado por seguridad (Foreign Key)
            await executeQuery('DELETE FROM inscripciones WHERE usuario_id = ?', [id]);

            // PASO 2: Ahora sí, eliminar al usuario (Padre)
            const sql = 'DELETE FROM usuarios WHERE id = ?';
            await executeQuery(sql, [id]);
            
            res.json({ success: true, message: 'Usuario y sus inscripciones eliminados correctamente.' });

        } catch (error) {
            console.error("Error al eliminar:", error);
            // Si es un error de integridad que se nos pasó, avisamos
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ success: false, message: 'No se puede eliminar: El usuario tiene datos relacionados en otras tablas.' });
            }
            res.status(500).json({ success: false, message: 'Error interno al eliminar.' });
        }
    }
};

module.exports = UsuarioController;