import nodemailer from "nodemailer";
import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

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

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: {email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signalist News" <${getNodemailerEmail()}>`,
        to: email,
        subject: `📈Market News Summary Today - ${date}`,
        text: `Today's market news summary from signalist`,
        html: htmlTemplate,
    };
    await transporter.sendMail(mailOptions);
};


