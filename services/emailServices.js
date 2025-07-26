const emailClient = require("../utils/email-connection");

const sendEmail = async ( {toEmail, toName, subject, htmlContent} ) => {
    try {
        const emailPayload = {
            to: [{ email: toEmail, name: toName }],
            sender: { email: "himanshu9536yadav@gmail.com", name: "Himanshu Yadav" },
            subject,
            htmlContent,
        };

        return await emailClient.sendTransacEmail(emailPayload);
    } catch (error) {
        console.log("Error: sendEmail", error.message);
    }

};

const sendResetLink = async (toEmail, toName, resetLink) => {
    const html = `
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
    `;
    return await sendEmail({
        toEmail,
        toName: toName,
        subject: "Reset Your Password - Expense Tracker",
        htmlContent: html
    });
};

module.exports = {
    sendEmail,
    sendResetLink
};
