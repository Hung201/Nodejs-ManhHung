import patientServices from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientServices.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the severhh'
        })
    }
}


module.exports = {
    postBookAppointment: postBookAppointment
}