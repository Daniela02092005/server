const axios = require("axios");
require("dotenv").config();

const sendRecoveryEmail = async (userEmail, resetToken) => {
  try {
    const recoveryLink = `${process.env.FRONTEND_URL}/#/reset_password?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const userId = process.env.EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      throw new Error("EmailJS credentials are not configured in environment variables.");
    }

    const emailData = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: {
        to_email: userEmail,
        recovery_link: recoveryLink,
      }
    };

    await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`Recovery email sent to ${userEmail} via EmailJS`);
  } catch (error) {
    console.error("Error sending recovery email with EmailJS:", error.response ? error.response.data : error.message);
    throw new Error(`Error sending email / Error enviando email: ${error.response ? error.response.data.message : error.message}`);
  }
};

module.exports = { sendRecoveryEmail };
