const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/justificanteController');
const fs = require('fs');


const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/subir', upload.single('archivo'), controller.subir);
router.get('/listar', controller.listar);

module.exports = router;