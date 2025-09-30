const nodemailer = require("nodemailer");
require("dotenv").config();

const port = process.env.EMAIL_PORT || 587;

console.log("📧 Configuración SMTP inicializada:");
console.log("  Host:", process.env.EMAIL_HOST);
console.log("  Port:", port);
console.log("  User:", process.env.EMAIL_USER);
console.log("  Frontend URL:", process.env.FRONTEND_URL);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: port,
  secure: false, // Brevo usa STARTTLS en 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRecoveryEmail = async (userEmail, resetToken) => {
  try {
    console.log("🔄 Preparando envío de email a:", userEmail);

    const recoveryLink = `${process.env.FRONTEND_URL}/reset_password.html?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;
    console.log("🔗 Enlace de recuperación generado:", recoveryLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Recuperación de Contraseña - CodeNova",
      html: `
        <h2>Recupera tu contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${recoveryLink}" style="background-color: #8300BF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace expira en 1 hora.</p>
        <p>Si no solicitaste esto, ignora este email.</p>
      `,
    };

    console.log("📨 Opciones de correo preparadas:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado:", info.messageId || info);

    console.log(`Recovery email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending recovery email:", error);
    throw new Error(`Error sending email / Error enviando email: ${error.message}`);
  }
};

module.exports = { sendRecoveryEmail };
