import db from "../models/index";
require('dotenv').config();


let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                //update patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                console.log('>>>check user hoidanit: ', user[0])


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