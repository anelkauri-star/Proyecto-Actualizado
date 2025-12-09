// backend/db/db_config.js
const mysql = require('mysql2/promise'); 

let pool;

// Configuración de las credenciales de MySQL
const dbConfig = {
    host: 'localhost',         //servidor MySQL
    user: 'root',  
    password: 'Pkpablo28', 
    database: 'congreso_mercadotecnias', 
    waitForConnections: true,
    connectionLimit: 10,       // Límite de conexiones simultáneas
    queueLimit: 0
};

async function initialize() {
    try {
        // Crea un Pool de conexiones al iniciar el servidor
        pool = mysql.createPool(dbConfig);
        console.log('✅ Pool de conexión a MySQL creado con éxito.');
    } catch (err) {
        console.error('❌ Error al crear el Pool de conexión:', err);
        process.exit(1); // Detiene la aplicación si la conexión falla
    }
}

// backend/db/db_config.js
async function executeQuery(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params); 
        return [rows]; 
    } catch (error) {
        console.error("Error al ejecutar consulta:", error);
        throw error;
    }
}

module.exports = {
    initialize,
    executeQuery
};