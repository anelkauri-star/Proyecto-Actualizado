const { executeQuery } = require('../config/db_config');

const UsuarioModel = {
    // 1. Método inteligente para crear usuarios (Sirve para Registro y Admin)
    create: async (data) => {
        // Determinamos la SQL base
        let sql = '';
        let params = [];

        // Lógica para construir la query según el tipo (tal como la tenías)
        if (data.tipo_registro === 'alumno') {
            sql = `INSERT INTO usuarios (
                nombre, apellido_paterno, apellido_materno, contrasena, tipo_registro, carrera, semestre, id_institucional, correo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            params = [
                data.nombre, data.apellido_paterno, data.apellido_materno, 
                data.contrasena, data.tipo_registro, data.carrera, 
                data.semestre, data.idInstitucional, data.correo
            ];
        } else {
            // Para admin, externos, etc.
            sql = `INSERT INTO usuarios (
                nombre, apellido_paterno, apellido_materno, contrasena, tipo_registro, correo
            ) VALUES (?, ?, ?, ?, ?, ?)`;

            params = [
                data.nombre, data.apellido_paterno, data.apellido_materno, 
                data.contrasena, data.tipo_registro, data.correo
            ];
        }

        const [result] = await executeQuery(sql, params);
        return result.insertId;
    },

    // 2. Método para listar usuarios (Usado en tu panel de admin)
    getAll: async () => {
        const sql = `
            SELECT id, tipo_registro, id_institucional, nombre, apellido_paterno, correo 
            FROM usuarios 
            ORDER BY tipo_registro, id_institucional
        `;
        const [rows] = await executeQuery(sql);
        return rows;
    },
    // 3. Buscar por correo (Para validaciones)
    findByEmail: async (correo) => {
        const sql = 'SELECT * FROM usuarios WHERE correo = ?';
        const [rows] = await executeQuery(sql, [correo]);
        return rows[0];
    },

    findByIdInstitucional: async (id) => {
        try {
            // Asegúrate de que la columna en tu BD se llame 'id_institucional'
            const sql = 'SELECT * FROM usuarios WHERE id_institucional = ?';
            const [rows] = await executeQuery(sql, [id]);
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UsuarioModel;