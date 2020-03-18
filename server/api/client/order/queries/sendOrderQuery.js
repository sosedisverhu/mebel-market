import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'stubbs.development@gmail.com';
const PASS = process.env.PASS || '7t5e6zh3gbkp';
const SENDER = process.env.SENDER || 'mebel-market-bot';

export default function saveApplication (subject, content, successCallback, failureCallback, receiverEmail) {
    const RECEIVER = receiverEmail || process.env.RECEIVER || 'n.brinzuk@gmail.com';
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
        html: content
    };

    return transporter.sendMail(mailOptions, error => {
        if (error) {
            return failureCallback();
        }

        return successCallback();
    });
}
