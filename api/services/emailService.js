const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto = require('crypto');

// Detectar qué puerto usar (primario o alternativo)
const port = process.env.EMAIL_PORT || process.env.EMAIL_PORT_ALT || 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: port,
  secure: port == 465, // SSL si es 465, STARTTLS si es 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // evita problemas de certificados en Render
  },
});

const sendRecoveryEmail = async (userEmail, resetToken) => {
  try {
    const recoveryLink = `${process.env.FRONTEND_URL}/reset_password.html?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Recuperación de Contraseña - CodeNova',
      html: `
             <h2>Recupera tu contraseña</h2>
             <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${recoveryLink}" style="background-color: #8300BF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
             <p>Este enlace expira en 1 hora.</p>
             <p>Si no solicitaste esto, ignora este email.</p>
           `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Recovery email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending recovery email:', error);
    throw new Error(`Error sending email / Error enviando email: ${error.message}`);
  }
};

module.exports = { sendRecoveryEmail };
