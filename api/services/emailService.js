require("dotenv").config();
const brevo = require("@getbrevo/brevo");

// Inicializar cliente de Brevo
const client = new brevo.TransactionalEmailsApi();
client.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

console.log("📧 Configuración Brevo inicializada:");
console.log("  Sender:", process.env.EMAIL_SENDER);
console.log("  Frontend URL:", process.env.FRONTEND_URL);

const sendRecoveryEmail = async (userEmail, resetToken) => {
  try {
    console.log("🔄 Preparando envío de email a:", userEmail);

    const recoveryLink = `${process.env.FRONTEND_URL}/reset_password.html?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;
    console.log("🔗 Enlace de recuperación generado:", recoveryLink);

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

    console.log("📨 Opciones de correo preparadas:", {
      from: sendSmtpEmail.sender.email,
      to: userEmail,
      subject: sendSmtpEmail.subject,
    });

    const data = await client.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email enviado con Brevo API:", data.messageId || data);

    console.log(`Recovery email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error enviando email con Brevo API:");
    if (error.response && error.response.text) {
      console.error("Detalles del error:", error.response.text);
    } else {
      console.error(error);
    }
    throw new Error(`Error enviando email: ${error.message}`);
  }
};

module.exports = { sendRecoveryEmail };
