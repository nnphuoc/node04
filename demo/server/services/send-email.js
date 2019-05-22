"use strict";
import nodemailer from 'nodemailer';

export default class sendEmail {
    static async send (email, code) {
        try {
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'blackholen.klh@gmail.com',
                    pass: 'ngocphuoc.lol'
                }
            });
            transporter.verify();
            let info = await transporter.sendMail({
                from: 'Test Send Mail', // sender address
                to: email, // list of receivers
                subject: "Forgot password", // Subject line
                text: "Your code is: " + code, // plain text body
                html: "Your code is: " + code // html body
            });
            return 'success';
        } catch (e) {
            return 'failed';
        }
    }
};

  