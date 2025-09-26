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
  console.log('Intentando enviar email a:', to);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Configurado' : 'No configurado');
  const recoveryLink = `${process.env.FRONTEND_URL}/#/reset_password?token=${token}`;
  console.log('Recovery link:', recoveryLink);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Recuperación de Contraseña - CodeNova',
    html: `...` // tu HTML
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
