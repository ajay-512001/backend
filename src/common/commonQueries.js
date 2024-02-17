const getRoles = "select * from roles order by role_id";
const getStreamRoles = "select * from stream_roles where role_id in($1) order by stream_id";
const getsubroles = "select * from subroles order by subrole_id";
const getClassRoles = "select * from class_roles order by class_id ";

module.exports={
    getRoles,
    getsubroles,
    getClassRoles,
    getStreamRoles
}