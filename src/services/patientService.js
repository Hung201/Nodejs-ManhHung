import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.birthday
                || !data.selectedGender || !data.reason || !data.address || !data.phoneNumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let res = {};

                //update patient
                let user = await db.User.findOne({
                    where: { email: data.email },
                });

                // find latest entry
                if (user && user.email) {
                    let eleLatest = await db.Booking.findOne({
                        where: {
                            patientId: user.id
                        },
                        order: [['createdAt', 'DESC']],
                    });
                    if (!eleLatest) {
                        await db.Booking.findOrCreate({
                            where: { patientId: user.id },
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: user.id,
                                date: data.date,
                                timeType: data.timeType
                            }
                        })

                        res.errCode = 0;
                        res.errMessage = 'Save infor patient success!'
                        // send email
                        await emailService.sendSimpleEmail({
                            reciverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: 'https://www.youtube.com/watch?v=puA-NnjVuiY&t=623s'
                        })
                    }
                    else if (eleLatest && eleLatest.statusId === 'S3' || eleLatest.statusId === 'S4') {
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType
                        });

                        res.errCode = 0;
                        res.errMessage = 'Save infor patient success!'
                        // send email
                        await emailService.sendSimpleEmail({
                            reciverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: 'https://www.youtube.com/watch?v=puA-NnjVuiY&t=623s'
                        })
                    }
                    else if (eleLatest && eleLatest.statusId === 'S1' || eleLatest.statusId === 'S2') {
                        res.errCode = 2;
                        res.errMessage = 'Save infor patient failed!'
                    }
                } else {
                    res.errCode = 3;
                    res.errMessage = `Your email doesn't exist!`
                }
                resolve({ res })
            }
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    postBookAppointment: postBookAppointment
}