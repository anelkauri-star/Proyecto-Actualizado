const EventoModel = require('../models/EventoModel');

const eventosController = {
    // GET: Obtener eventos
    obtenerEventos: async (req, res) => {
        try {
            const fecha = req.query.date || 'all';
            const eventos = await EventoModel.getAll(fecha);
            
            
            res.json({ 
                success: true, 
                events: eventos 
            });
        } catch (error) {
            console.error("Error al obtener eventos:", error);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno al cargar eventos' 
            });
        }
    },

    // POST: Agregar evento
    agregarEvento: async (req, res) => {
        try {
            const nuevoId = await EventoModel.create(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Evento agregado correctamente', 
                id: nuevoId 
            });
        } catch (error) {
            console.error("Error al crear evento:", error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al guardar el evento' 
            });
        }
    }
};

module.exports = eventosController;