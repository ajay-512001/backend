const adminRouter = require('express')
const adminController = require('./adminController')
const adminrouter = adminRouter();


adminrouter.post('/getuserlist', adminController.getUserList);

adminrouter.post('/getadminlist', adminController.getAdminList);

adminrouter.post('/getuserroleinfo', adminController.getUserRoleInfoById);

adminrouter.post('/updateroleinfo', adminController.updateUserRoleInfoById);

adminrouter.post('/getadmininfo', adminController.getAdminInfo);

adminrouter.post('/updateAdmininfo', adminController.updateAdminInfo);

module.exports = adminrouter;