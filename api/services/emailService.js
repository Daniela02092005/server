const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRecoveryEmail = async (userEmail, resetToken) => {
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // Si usas hashed
  const recoveryLink = `${process.env.FRONTEND_URL}/reset_password.html?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Recuperar Contraseña - CodeNova",
    html: `
      <p>Haz clic en este enlace para restablecer tu contraseña:</p>
      <a href="${recoveryLink}">Restablecer Contraseña</a>
      <p>El enlace expira en 1 hora.</p>
    `
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
