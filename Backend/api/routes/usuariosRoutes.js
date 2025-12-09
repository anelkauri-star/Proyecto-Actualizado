const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// GET /api/usuarios -> Listar todos
router.get('/', usuariosController.listarTodos);

// POST /api/usuarios/admin -> Agregar desde panel admin
router.post('/admin', usuariosController.agregarDesdeAdmin);

// DELETE /api/usuarios/:id -> Eliminar usuario
router.delete('/:id', usuariosController.eliminar);

module.exports = router;