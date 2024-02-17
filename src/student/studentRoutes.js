const studentRouter = require('express')
const studentController = require('./studentController')
const studentrouter = studentRouter();

studentrouter.post('/getstudentlist', studentController.getStudentList);

studentrouter.post('/getstudentinfo', studentController.getStudentInfo);

studentrouter.post('/updatstudentinfo', studentController.updatestudentInfo);

module.exports = studentrouter;