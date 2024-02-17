const getUserByUserIdRoleId = "select * from user_master where user_id = $1 and role_id = $2";
const updatUserInfo = "update user_master set role_id = $1 ,username = $2, email = $3, photo =$5 , updated_by = $6 where user_id = $4";
const getUserListquer = "select * from user_master order by user_id desc";
const checkUserPresenceInAdmin = "select * from admin where user_id =$1"
const checkUserPresenceInTeacher = "select * from teacher where user_id =$1"
const checkUserPresenceInStudent = "select * from student where user_id =$1"
const updateStatusadmin = "update admin set isactive = $2 where user_id = $1"
const updateStatusteacher = "update teacher set isactive = $2 where user_id = $1"
const updateStatusstudent = "update student set isactive = $2 where user_id = $1"
const insertStudent = "INSERT INTO student(user_id, student_name, role_id, email, isactive) VALUES ($1, $2, $3, $4, $5)"
const insertTeacher = "INSERT INTO teacher(user_id, teacher_name, role_id, email, isactive) VALUES ($1, $2, $3, $4, $5)"
const insertAdmin = "INSERT INTO admin(user_id, admin_name, role_id, email, isactive) VALUES ($1, $2, $3, $4, $5)"
const updateadmin = "update admin set email = $1 where user_id = $2"
const updateteacher = "update teacher set email = $1 where user_id = $2"
const updatestudent = "update student set email = $1 where user_id = $2"
const getAdminList = "select iupad.*,iupum.photo from admin as iupad left join user_master as iupum on iupum.user_id = iupad.user_id where iupad.isactive='true' order by iupad.admin_id desc"
const getUserListquerbyRole = "select * from user_master where role_id = $1 order by user_id desc";


const getAdminInfo = "select iupum.photo,iupum.username,iupad.* from admin as iupad left join user_master as iupum on iupum.user_id = iupad.user_id where iupad.user_id= $1";
const updateAdminInfoAdminTable = "UPDATE admin SET email= $2, admin_name= $3, dob= $4, aadhar_no= $5, admin_info= $6, hire_date= $7, bdg= $8, mobileno= $9,stream_id = $10,class_id = $11, subrole_id= $12 WHERE user_id = $1";
const updateAdminInfoinUser = "UPDATE user_master SET email = $2, photo =$3 where user_id = $1";




module.exports={
    getUserByUserIdRoleId,
    updatUserInfo,
    getUserListquer,
    checkUserPresenceInAdmin,
    checkUserPresenceInTeacher,
    checkUserPresenceInStudent,
    updateStatusadmin,
    updateStatusteacher,
    updateStatusstudent,
    insertAdmin,
    insertTeacher,
    insertStudent,
    updateadmin,
    updateteacher,
    updatestudent,
    getAdminList,
    getUserListquerbyRole,
    getAdminInfo,
    updateAdminInfoAdminTable,
    updateAdminInfoinUser
}