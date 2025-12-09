const { executeQuery } = require('../config/db_config'); // Ajusta ruta a tu config

const InscripcionModel = {
    // 1. Verificar si ya existe esa combinación (para evitar duplicados)
    verificar: async (usuarioId, eventoId) => {
        const sql = 'SELECT * FROM inscripciones WHERE usuario_id = ? AND evento_id = ?';
        const [rows] = await executeQuery(sql, [usuarioId, eventoId]);
        return rows[0]; 
    },

    // 2. Guardar la inscripción
    inscribir: async (usuarioId, eventoId) => {
        const sql = 'INSERT INTO inscripciones (usuario_id, evento_id) VALUES (?, ?)';
        const [result] = await executeQuery(sql, [usuarioId, eventoId]);
        return result.insertId;
    }
};

module.exports = InscripcionModel;