import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: 'https://www.youtube.com/watch?v=puA-NnjVuiY&t=623s'
                })
                //update patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                // find latest entry
                if (user && user[0]) {
                    let eleLatest = await db.Booking.findOne({
                        where: {
                            patientId: user[0].id
                        },
                        order: [['createdAt', 'DESC']],
                    });
                    if (!eleLatest) {
                        await db.Booking.findOrCreate({
                            where: { patientId: user[0].id },
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: user[0].id,
                                date: data.date,
                                timeType: data.timeType
                            }
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Save infor patient success!'
                        })
                    }
                    if (eleLatest && eleLatest.statusId === 'S3' || eleLatest.statusId === 'S4') {
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        });
                        resolve({
                            errCode: 0,
                            errMessage: 'Save infor patient success!'
                        })
                    }
                    console.log('check ele:', eleLatest)
                }



            }

        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    postBookAppointment: postBookAppointment
}