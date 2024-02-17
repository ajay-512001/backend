const getTeacherList = "select iuptc.*,iupum.photo from teacher as iuptc left join user_master as iupum on iupum.user_id = iuptc.user_id where iuptc.isactive='true' order by iuptc.teacher_id desc";
const getTeacherInfo = "select iupum.photo,iupum.username,ipttb.class_id,ipttb.stream_id,ipttb.subrole_id,iuptc.* from teacher as iuptc left join user_master as iupum on iupum.user_id = iuptc.user_id left Join teacher_timetable as ipttb on ipttb.teacher_id = iuptc.teacher_id where iuptc.user_id= $1";
const getTeacherTimeInfo = "SELECT STRING_AGG(teachertime_id::TEXT, ',') AS concatenated_ids FROM teacher_timetable where teacher_id = $1";
const getTimeInfo = "select * from teacher_timetable where user_id = $1";

const updateTeacherInfoTeacherTable = "UPDATE teacher SET email= $2, teacher_name= $3, dob= $4, aadhar_no= $5, teacher_info= $6, hire_date= $7, bdg= $8, mobileno= $9, teachertime_id = $10 WHERE user_id = $1;";
const updateTeacherInfoinUser = "UPDATE user_master SET email = $2, photo =$3 where user_id = $1";
const updateTeacherTimeInfo = "INSERT INTO teacher_timetable (teacher_id, user_id, stream_id, class_id, subrole_id) VALUES ($1, $2, $3, $4, $5) ";

const deleteCurrentTeacherTime = "DELETE from teacher_timetable where user_id = $1 and teacher_id = $2";

module.exports={
    getTeacherList,
    getTeacherInfo,
    updateTeacherInfoTeacherTable,
    updateTeacherInfoinUser,
    deleteCurrentTeacherTime,
    updateTeacherTimeInfo,
    getTeacherTimeInfo,
    getTimeInfo,
}