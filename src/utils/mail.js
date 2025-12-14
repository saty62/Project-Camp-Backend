import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// MAIN EMAIL SENDER FUNCTION
const sendEmail = async (options) => {
    // Mailgen configuration
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagelink.com",
        },
    });

    // Generate email body
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    // Email structure
    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    };

    // Sending email
    try {
        await transporter.sendMail(mail);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Email service failed. Check your MAILTRAP credentials.");
        console.error("Error:", error);
    }
};

// EMAIL VERIFICATION MAIL TEMPLATE
const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our App! We're excited to have you on board.",
            action: {
                instructions: "To verify your email, please click the button below:",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help? Just reply to this email — we're here for you.",
        },
    };
};

// FORGOT PASSWORD MAIL TEMPLATE
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We received a request to reset the password for your account.",
            action: {
                instructions: "To reset your password, click the button below:",
                button: {
                    color: "#22BC66",
                    text: "Reset Password",
                    link: passwordResetUrl,
                },
            },
            outro: "If you didn’t request this, you can safely ignore this email.",
        },
    };
};

// EXPORTS
export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
};
