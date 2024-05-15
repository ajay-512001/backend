const getRoles = "select * from roles order by role_id";
const getStreamRoles = "select * from stream_roles where role_id in($1) order by stream_id";
const getsubroles = "select * from subroles order by subrole_id";
const getClassRoles = "select * from class_roles order by class_id ";
const  sendNotification = "select * from sendnotificationemail order by notif_id desc";
const findRole = "select role_name from roles where role_id in (select role_id FROM user_master where email=$1)";
const sendNotificationbyId = "select * from sendnotificationemail where notif_id = $1";
const username = "select username FROM user_master where email=$1"

module.exports={
    getRoles,
    getsubroles,
    getClassRoles,
    getStreamRoles,
    sendNotification,
    findRole,
    sendNotificationbyId,
    username
}