const express = require('express');
const router = express.Router();
const constanciaController = require('../controllers/constanciaController');

// GET /api/constancias/:idInstitucional
router.get('/:idInstitucional', constanciaController.generar);

module.exports = router;
