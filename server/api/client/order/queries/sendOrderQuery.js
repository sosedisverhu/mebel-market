import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'stubbs.development@gmail.com';
const PASS = process.env.PASS || '7t5e6zh3gbkp';
const SENDER = process.env.SENDER || 'mebel-market-bot';
const RECEIVER = process.env.RECEIVER || 'v.bilous14@gmail.com';

export default function saveApplication (subject, content, successCallback, failureCallback, receiverEmail) {
    const receiver = receiverEmail || RECEIVER;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: LOGIN,
            pass: PASS
        }
    });
    const mailOptions = {
        from: SENDER,
        to: receiver,
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
