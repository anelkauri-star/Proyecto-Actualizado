const InscripcionModel = require('../models/InscripcionModel');
const UsuarioModel = require('../models/UsuarioModel');
const { enviarCorreo } = require('../config/mailer'); // Mailer

const inscripcionController = {
    inscribirAlumno: async (req, res) => {
        const { idInstitucional, eventoId } = req.body;

        if (!idInstitucional || !eventoId) {
            return res.status(400).json({ success: false, message: 'Faltan datos.' });
        }

        try {
            // Buscar alumno
            const alumno = await UsuarioModel.findByIdInstitucional(idInstitucional);
            if (!alumno) return res.status(404).json({ success: false, message: 'Alumno no encontrado.' });

            // Verificar si ya está inscrito
            const yaExiste = await InscripcionModel.verificar(alumno.id, eventoId);
            if (yaExiste) return res.status(400).json({ success: false, message: `El alumno ya está inscrito.` });

            // Inscribir en BD
            await InscripcionModel.inscribir(alumno.id, eventoId);
            
            // ENVIAR NOTIFICACIÓN POR CORREO
            const asunto = 'Confirmación de Inscripción - Congreso UAA';
            const mensaje = `
                <h1>¡Hola ${alumno.nombre}!</h1>
                <p>Tu inscripción al evento ha sido confirmada exitosamente.</p>
                <p><strong>ID de Alumno:</strong> ${alumno.id_institucional}</p>
                <p>Te esperamos.</p>
                <hr>
                <small>Congreso de Mercadotecnia UAA</small>
            `;

            
            enviarCorreo(alumno.correo, asunto, mensaje);

            res.json({ 
                success: true, 
                message: `¡Éxito! ${alumno.nombre} inscrito y notificado por correo.` 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error interno.' });
        }
    },
};

module.exports = inscripcionController;