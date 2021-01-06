import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'mebelmarket123@gmail.com';
const PASS = process.env.PASS || 'Qweqwe123.';
const SENDER = process.env.SENDER || 'МебельМаркет <mebelmarket123@gmail.com>';

export default function sendRecoveryEmail (email, subject, content, successCallback, failureCallback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: LOGIN,
            pass: PASS
        }
    });
    const mailOptions = {
        from: SENDER,
        to: email,
        subject,
        html: content
    };

    return transporter.sendMail(mailOptions, error => {
        if (error) {
            return failureCallback();
        }

        return successCallback();
    });
}
