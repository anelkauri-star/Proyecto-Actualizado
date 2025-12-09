// backend/server.js
const express = require('express');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); //Importamos Socket.IO
const db = require('./api/config/db_config');

// Importación de rutas
const eventosRoutes = require('./api/routes/eventosRoutes'); 
const registroRoutes = require('./api/routes/registroRoutes'); 
const loginRoutes = require('./api/routes/loginRoutes');
const usuariosRoutes = require('./api/routes/usuariosRoutes');
const inscripcionRoutes = require('./api/routes/inscripcionRoutes');
const constanciaRoutes = require('./api/routes/constanciaRoutes');
const justificanteRoutes = require('./api/routes/justificanteRoutes');
const path = require('path');

const app = express();
const PORT = 3000; 

// Crear el servidor HTTP usando la app de Express
const server = http.createServer(app);

//Configurar Socket.IO sobre ese servidor
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set('io', io);

// Evento de conexión para ver si funciona)
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado: ' + socket.id);
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// RUTAS
app.use('/api/eventos', eventosRoutes); 
app.use('/api/registro', registroRoutes); 
app.use('/api/login', loginRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/constancias', constanciaRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/justificantes', justificanteRoutes);
app.get('/', (req, res) => {
    res.send('Servidor Node.js con Sockets funcionando.');
});

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno', error: err.message });
});

//Socket
db.initialize().then(() => {
    server.listen(PORT, () => {
        console.log(` Backend y Sockets escuchando en: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error(' Error fatal en DB:', err);
    process.exit(1);
});