const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendRecoveryEmail(to, token) {
  // Para Vite/Vercel, la ruta debe incluir el hash routing
  const recoveryLink = `${process.env.FRONTEND_URL}/#/reset_password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Recuperación de Contraseña - CodeNova',
    html: `
      <p>Has solicitado restablecer tu contraseña para CodeNova.</p>
      <p>Haz clic en el siguiente enlace para restablecerla:</p>
      <a href="${recoveryLink}">Restablecer Contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste esto, por favor ignora este correo.</p>
    `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado:', info.response);
    return info;
  } catch (error) {
    console.error('Error enviando correo de recuperación:', error);
    throw error;
  }
}


async function sendPasswordByEmail(to, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Tu Contraseña Temporal - SmartBilling',
    html: `
          <p>Has solicitado tu contraseña para CodeNova.</p>
          <p>Tu nueva contraseña temporal es: <strong>${password}</strong></p>
          <p>Por favor, inicia sesión con esta contraseña y cámbiala lo antes posible.</p>
          <p>Si no solicitaste esto, por favor ignora este correo.</p>
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
