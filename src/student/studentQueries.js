const getStudentList = "select iupsd.*,iupum.photo from student as iupsd left join user_master as iupum on iupum.user_id = iupsd.user_id where iupsd.isactive='true' order by iupsd.student_id desc"
const getStudentInfo = "select iupum.photo,iupum.username,iupsc.* from student as iupsc left join user_master as iupum on iupum.user_id = iupsc.user_id where iupsc.user_id= $1";

const updateTeacherInfoStudentTable = "UPDATE student SET email= $2, student_name= $3, dob= $4, aadhar_no= $5, student_info= $6, enroll_date= $7, bdg= $8, mobileno= $9,stream_id = $10,class_id = $11, subrole_id= $12 WHERE user_id = $1";
const updateStudentInfoinUser = "UPDATE user_master SET email = $2, photo =$3 where user_id = $1";



module.exports={
    getStudentList,
    getStudentInfo,
    updateTeacherInfoStudentTable,
    updateStudentInfoinUser
}
