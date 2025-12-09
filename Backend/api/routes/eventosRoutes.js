// backend/api/routesmkdir/eventosRoutes.js

const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');

// Definir las rutas
router.get('/', eventosController.obtenerEventos); // GET /api/eventos
router.post('/', eventosController.agregarEvento); // POST /api/eventos

module.exports = router;