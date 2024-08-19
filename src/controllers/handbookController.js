import handbookService from '../services/handbookService'

let createHandbook = async (req, res) => {
    try {
        let infor = await handbookService.createHandbook(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandbook();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}
let getDetailHandbookById = async (req, res) => {
    try {
        let infor = await handbookService.getDetailHandbookById(req.query.id);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

module.exports = {
    createHandbook, getAllHandbook, getDetailHandbookById
}