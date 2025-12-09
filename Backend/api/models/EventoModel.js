const { executeQuery } = require('../config/db_config'); // Ajusta la ruta si tu carpeta es 'db'

const EventoModel = {
    // 1. Obtener todos los eventos
    getAll: async (fecha) => {
        let sql = 'SELECT * FROM eventos';
        let params = [];
        
        if (fecha && fecha !== 'all') {
            sql += ' WHERE fecha = ?';
            params.push(fecha);
        }
        
        sql += ' ORDER BY fecha ASC, hora_inicio ASC';
        
        const [rows] = await executeQuery(sql, params);
        return rows;
    },

    // 2. Crear un nuevo evento
    create: async (data) => {
        const sql = `
            INSERT INTO eventos 
            (fecha, hora_inicio, hora_fin, lugar, tipo_evento, conferencista_responsable, actividad)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        // Estos nombres (data.eventDate) deben coincidir con los "name" de tu HTML
        const params = [
            data.eventDate,
            data.eventStartTime,
            data.eventEndTime,
            data.eventPlace,
            data.eventType,
            data.eventSpeaker,
            data.eventActivity
        ];
        
        const [result] = await executeQuery(sql, params);
        return result.insertId;
    }
};

module.exports = EventoModel;