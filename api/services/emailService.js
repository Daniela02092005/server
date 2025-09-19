const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar otros servicios como 'Outlook365', 'SendGrid', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
* Envía un correo electrónico de recuperación de contraseña.
* @param {string} to - Dirección de correo del destinatario.
* @param {string} token - Token de recuperación de contraseña.
* @returns {Promise<Object>} Información del envío del correo.
*/
async function sendRecoveryEmail(to, token) {
    const recoveryLink = `${process.env.FRONTEND_URL}/#/reset_password?token=${token}`; // URL del frontend para restablecer
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Recuperación de Contraseña - SmartBilling',
        html: `
              <p>Has solicitado restablecer tu contraseña para CodeNova.</p>
              <p>Haz clic en el siguiente enlace para restablecerla:</p>
              <a href="${recoveryLink}">Restablecer Contraseña</a>
              <p>Este enlace expirará en 1 hora.</p>
              <p>Si no solicitaste esto, por favor ignora este correo.</p>
            `,
    };
    
    return transporter.sendMail(mailOptions);
}

module.exports = { sendRecoveryEmail };
        