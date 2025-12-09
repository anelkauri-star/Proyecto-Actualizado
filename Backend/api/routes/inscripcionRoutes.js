const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

router.post('/', inscripcionController.inscribirAlumno);

module.exports = router;