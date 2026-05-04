import nodemailer from "nodemailer";
import {WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

const getNodemailerEmail = () => {
    const email = process.env.NODEMAILER_EMAIL;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("NODEMAILER_EMAIL is required and must be a valid email address");
    }

    return email;
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: getNodemailerEmail(),
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"Signalist" <${getNodemailerEmail()}>`,
        to: email,
        subject: `Welcome to Signalist - your stock market toolkit is ready!`,
        text: 'Thanks for your joining Signalist !',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}
