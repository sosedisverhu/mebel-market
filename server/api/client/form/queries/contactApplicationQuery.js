import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'mebelmarket123@gmail.com';
const PASS = process.env.PASS || 'Qweqwe123.';
const SENDER = process.env.SENDER || 'МебельМаркет <mebelmarket123@gmail.com>';
const RECEIVER = process.env.RECEIVER || 'maxiv4545@gmail.com';

export default function contactApplication (subject, content, files, successCallback, failureCallback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: LOGIN,
            pass: PASS
        }
    });
    const mailOptions = {
        from: SENDER,
        to: RECEIVER,
        subject,
        html: content,
        attachments: files
    };

    return transporter.sendMail(mailOptions, error => {
        if (error) {
            return failureCallback();
        }

        return successCallback();
    });
}
