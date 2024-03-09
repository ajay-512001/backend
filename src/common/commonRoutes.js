const commonRouter = require('express')
const commonController = require('./commonController')
const commonrouter = commonRouter();

commonrouter.post('/getRoles', commonController.getRoles);

commonrouter.post('/getSubRoles', commonController.getSubRoles);

commonrouter.post('/getStreamRoles', commonController.getStreamRoles);

commonrouter.post('/getClassRoles', commonController.getClassRoles);

commonrouter.post('/excelUpload', commonController.excelUpload);

module.exports = commonrouter;