const UsuarioModel = require('../models/UsuarioModel');
const { ConstanciaFactory } = require('../services/constanciaFactory');

const constanciaController = {
    generar: async (req, res) => {
        const { idInstitucional } = req.params;

        if (!idInstitucional) {
            return res.status(400).json({ message: "Falta el ID Institucional" });
        }

        try {
            // 1. Buscar datos del alumno en la BD
            const alumno = await UsuarioModel.findByIdInstitucional(idInstitucional);

            if (!alumno) {
                return res.status(404).json({ message: "Alumno no encontrado" });
            }

            // 2. Usar la Factory para crear el PDF
            const constancia = ConstanciaFactory.crearConstancia(alumno);
            const pdfBuffer = await constancia.generarPDF();

            // 3. Configurar respuesta para descargar archivo
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=constancia_${idInstitucional}.pdf`);
            res.send(pdfBuffer);

        } catch (error) {
            console.error("Error al generar PDF:", error);
            res.status(500).json({ message: "Error interno al generar documento" });
        }
    }
};

module.exports = constanciaController;