import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
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

                //update patient
                let user = await db.User.findOne({
                    where: { email: data.email },
                    raw: false
                });

                // find latest entry
                if (user && user.email) {
                    user.address = data.address;
                    user.gender = data.selectedGender;
                    user.phonenumber = data.phoneNumber;
                    user.firstName = data.fullName;
                    await user.save();
                    let eleLatest = await db.Booking.findOne({
                        where: {
                            patientId: user.id
                        },
                        order: [['createdAt', 'DESC']],
                    });

                    let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                    if (!eleLatest) {
                        await db.Booking.findOrCreate({
                            where: { patientId: user.id },
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: user.id,
                                date: data.date,
                                timeType: data.timeType,
                                token: token
                            }
                        })

                        resolve({
                            errCode: 0,
                            errMessage: 'Save infor patient success!'
                        })

                        // send email
                        await emailService.sendSimpleEmail({
                            reciverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: buildUrlEmail(data.doctorId, token)
                        })
                    }
                    else if (eleLatest && eleLatest.statusId === 'S3' || eleLatest.statusId === 'S4') {
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        });
                        resolve({
                            errCode: 0,
                            errMessage: 'Save infor patient success!'
                        })

                        // send email

                        await emailService.sendSimpleEmail({
                            reciverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: buildUrlEmail(data.doctorId, token)
                        })
                    }
                    else if (eleLatest && eleLatest.statusId === 'S1' || eleLatest.statusId === 'S2') {
                        resolve({
                            errCode: 2,
                            errMessage: 'Save infor patient failed!'
                        })
                    }
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: `Your email doesn't exist!`
                    })
                }
                resolve({ res })
            }
        } catch (e) {
            reject(e)
        }
    })
}


let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}