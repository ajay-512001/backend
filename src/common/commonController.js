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


module.exports = {
    getRoles,
    getSubRoles,
    getStreamRoles,
    getClassRoles,
};