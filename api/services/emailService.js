const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendRecoveryEmail(to, token, email) {
  console.log("Intentando enviar email a:", to);
  const recoveryLink = `${process.env.FRONTEND_URL || "https://client-theta-bay.vercel.app"}/reset_password.html?token=${token}&email=${encodeURIComponent(email)}`;
  console.log("Recovery link:", recoveryLink);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Recuperación de Contraseña - CodeNova",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña en CodeNova. Haz clic en el enlace:</p>
        <a href="${recoveryLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace expira en 1 hora.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente:", info.response);
    return info;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
}

module.exports = { sendRecoveryEmail };
