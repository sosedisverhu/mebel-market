import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'stubbs.development@gmail.com';
const PASS = process.env.PASS || 'fNDCNBtDKMBv';
const SENDER = process.env.SENDER || 'mebel-market-bot';
const RECEIVER = process.env.RECEIVER || 'n.brinzuk@gmail.com';

export default function saveApplication (subject, content, successCallback, failureCallback) {
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
