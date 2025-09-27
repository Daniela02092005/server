const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendRecoveryEmail(to, token) {
  console.log('Intentando enviar email a:', to);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Configurado' : 'No configurado');
  const recoveryLink = `${process.env.FRONTEND_URL}/reset_password?token=${token}`;
  console.log('Recovery link:', recoveryLink);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Recuperación de Contraseña - CodeNova',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña en CodeNova. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${recoveryLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
        <p>Saludos,<br>Equipo CodeNova</p>
      </div>
    `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente:', info.response);
    return info;
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
}

async function sendPasswordByEmail(to, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Tu Contraseña Temporal - SmartBilling',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Contraseña Temporal</h2>
        <p>Has solicitado tu contraseña para CodeNova.</p>
        <p>Tu nueva contraseña temporal es: <strong>${password}</strong></p>
        <p>Por favor, inicia sesión con esta contraseña y cámbiala lo antes posible.</p>
        <p>Si no solicitaste esto, por favor ignora este correo.</p>
        <p>Saludos,<br>Equipo CodeNova</p>
      </div>
    `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de contraseña temporal enviado:', info.response);
    return info;
  } catch (error) {
    console.error('Error enviando correo de contraseña temporal:', error);
    throw error;
  }
}

module.exports = { sendRecoveryEmail, sendPasswordByEmail };
