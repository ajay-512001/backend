const pool = require("../../db");
const commonQueries = require("./commonQueries");
const commonFunction = require("./commonFunction");

const getRoles = (req,res)  => {
    commonFunction.getRoles(req.body,res);
}

const getStreamRoles = (req,res)  => {
    commonFunction.getStreamRoles(req.body,res);
}

const getClassRoles = (req,res)  => {
    commonFunction.getClassRoles(req.body,res);
}

const getSubRoles = (req,res)  => {
    commonFunction.getSubRoles(req.body,res);
}

const excelUpload = (req,res) => {
    commonFunction.excelUpload(req.body,res)
}

const generatePDF = (req,res) => {
    commonFunction.generatePDF(req.body,res)
}

const getNotifList = (req,res) => {
    commonFunction.getNotifList(req.body,res)
}

const sendNotifbyId = (req,res) => {
    commonFunction.sendNotifbyId(req.body,res)
}

module.exports = {
    getRoles,
    getSubRoles,
    getStreamRoles,
    getClassRoles,
    excelUpload,
    generatePDF,
    getNotifList,
    sendNotifbyId
};