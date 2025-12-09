// backend/api/routes/loginRoutes.js

const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); 
console.log("Login Controller cargado:", typeof loginController.iniciarSesion);

// 🛑 CORRECCIÓN: Cambia '/login' por '/' 🛑
// Esto hace que la ruta completa sea: /api/login
router.post('/', loginController.iniciarSesion); 

module.exports = router;