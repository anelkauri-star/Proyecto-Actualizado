const { executeQuery } = require('../config/db_config');

const justificanteController = {
    subir: async (req, res) => {
        try {
            const { idAlumno, motivo } = req.body;
            const archivo = req.file; 

            if (!archivo || !idAlumno) {
                return res.status(400).json({ success: false, message: "Faltan datos." });
            }

            const ruta = `/uploads/${archivo.filename}`;

            
            await executeQuery(
                "INSERT INTO justificantes (id_alumno, motivo, archivo_ruta) VALUES (?, ?, ?)",
                [idAlumno, motivo, ruta]
            );

            res.json({ success: true, message: "Justificante enviado correctamente." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error al subir archivo." });
        }
    },


    listar: async (req, res) => {
        try {
            const sql = `
                SELECT j.id, j.motivo, j.archivo_ruta, j.fecha_subida, 
                       u.nombre, u.apellido_paterno, j.id_alumno
                FROM justificantes j
                JOIN usuarios u ON j.id_alumno = u.id_institucional
                ORDER BY j.fecha_subida DESC
            `;
            const lista = await executeQuery(sql);
            const datosLimpios = (Array.isArray(lista) && Array.isArray(lista[0])) ? lista[0] : lista;

            res.json({ success: true, data: datosLimpios });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error al obtener lista." });
        }
    }
};

module.exports = justificanteController;