const teacherRouter = require('express')
const teacherController = require('./teacherController')
const teacherrouter = teacherRouter();

teacherrouter.post('/getteacherlist', teacherController.getTeacherList);

teacherrouter.post('/getteacherinfo', teacherController.getTeacherInfo);

teacherrouter.post('/updateteacherinfo', teacherController.updateTeacherInfo);

module.exports = teacherrouter;