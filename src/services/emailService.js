require('dotenv').config();
import nodemailer from 'nodemailer'

"use strict";
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Phạm Mạnh Hùng 👻" <hungphammanh777@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: `
        <h3>Xin chào, ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Phạm Mạnh Hùng</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>
        Nếu các thông tin là đúng sự thật vui lòng click vào đường link bên dưới
         để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh
         </p>
         <div>
         <a href=${dataSend.redirectLink} target="_blank">Click here</a>
         </div>

         <div>Xin chân thành cảm ơn!</div>
        `, // html body
    });
}


module.exports = {
    sendSimpleEmail
}