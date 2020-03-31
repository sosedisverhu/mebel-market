import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'dev.occam@gmail.com';
const PASS = process.env.PASS || 'R4*KCCe-r*<5bEsQ';
const SENDER = process.env.SENDER || 'Dev minion';

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
