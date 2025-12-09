const nodemailer = require('nodemailer');

// Configuración para conectar con Outlook
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Servidor de Outlook
    port: 587, // Puerto estándar TLS
    secure: false,
    auth: {
        user: 'al238954@edu.uaa.mx', //Correo 
        pass: 'Jpvz2806' //Contraseña
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

const enviarCorreo = async (destinatario, asunto, textoHTML) => {
    try {
        const info = await transporter.sendMail({
            from: '"Congreso UAA" <al238954@edu.uaa.mx>', // Quien lo envía
            to: destinatario, // A quien le recibe
            subject: asunto, 
            html: textoHTML 
        });
        console.log("Correo enviado: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error al enviar correo:", error);
        return false;
    }
};

module.exports = { enviarCorreo };