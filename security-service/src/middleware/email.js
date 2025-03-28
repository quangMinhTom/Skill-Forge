import Nodemailer from 'nodemailer';
import { MailtrapTransport } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.MAILTRAP_API_KEY;

export default function mailHandler(options) {

const transport = Nodemailer.createTransport(
    MailtrapTransport({
        token: TOKEN,
    })
);

const sender = {
    address: "hello@demomailtrap.co",
    name: "Skill Forge",
};

const recipients = [
    options.recipient,
    //"qminh1290@gmail.com"
];
const resetToken = options.token;

transport
    .sendMail({
        from: sender,
        to: recipients,
        subject: "Reset password",
        text: "Congrats for sending a test email! Visit Google at: https://www.google.com", // Fallback for plain-text clients
        html: `
            <p>Congrats for sending a test email!</p>
            <p>Your token: <strong>${resetToken}</strong></p>
            <p>Visit <a href="https://www.google.com">Google</a> for more awesomeness!</p>
        `, // HTML with clickable link
        category: "Integration Test",
    })
    .then(console.log, console.error);

}

