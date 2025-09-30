const nodemailer = require("nodemailer");
require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

const useApiOnly = process.env.USE_BREVO_API === "true";

// 📧 Configuración inicial
console.log("📧 Configuración de Email inicializada:");
console.log("  Modo API:", useApiOnly);
console.log("  Frontend URL:", process.env.FRONTEND_URL);

let transporter = null;

// 🚀 Solo inicializamos nodemailer si no estamos en modo API
if (!useApiOnly) {
  const port = process.env.EMAIL_PORT || 587;

  console.log("  Host:", process.env.EMAIL_HOST);
  console.log("  Port:", port);
  console.log("  User (sender):", process.env.EMAIL_SENDER);

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: false, // Brevo usa STARTTLS en 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // 🚀 Configurar cliente API Brevo
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
}

const sendRecoveryEmail = async (userEmail, resetToken) => {
  try {
    console.log("🔄 Preparando envío de email a:", userEmail);

    const recoveryLink = `${process.env.FRONTEND_URL}/reset_password.html?token=${resetToken}&email=${encodeURIComponent(
      userEmail
    )}`;
    console.log("🔗 Enlace de recuperación generado:", recoveryLink);

    if (useApiOnly) {
      // 🚀 Usar API de Brevo (Render/Producción)
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = {
        sender: { email: process.env.EMAIL_SENDER, name: "CodeNova" },
        to: [{ email: userEmail }],
        subject: "Recuperación de Contraseña - CodeNova",
        htmlContent: `
          <h2>Recupera tu contraseña</h2>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${recoveryLink}" style="background-color: #8300BF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
          <p>Este enlace expira en 1 hora.</p>
          <p>Si no solicitaste esto, ignora este email.</p>
        `,
      };

      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("✅ Email enviado por API:", data.messageId || data);
    } else {
      // 🚀 Usar SMTP (solo local)
      const mailOptions = {
        from: process.env.EMAIL_SENDER,
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
      console.log("✅ Email enviado por SMTP:", info.messageId || info);
    }
  } catch (error) {
    console.error("❌ Error sending recovery email:", error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

module.exports = { sendRecoveryEmail };
