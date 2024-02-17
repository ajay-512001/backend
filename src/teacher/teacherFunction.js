const pool = require("../../db");
const teacherQueries = require("./teacherQuery");

function updateTeacherInfoWithTime(req,res) {
    const { s_role_id,s_user_id,user_id,teacher_id ,teacher_obj } = req;
    if(teacher_obj != undefined && teacher_obj != null && teacher_obj != ""){
        let email = teacher_obj.email;
        let teacher_name = teacher_obj.teacher_name;
        let dob = teacher_obj.dob;
        let aadhar_no = teacher_obj.aadhar_no;
        let teacher_info = teacher_obj.teacher_info;
        let hire_date = teacher_obj.hire_date;
        let bdg = teacher_obj.bdg;
        let mobileno = teacher_obj.mobileno;
        let photo = teacher_obj.photo;
        let teachertime_id = "";
        let updatecnt = 0;
        pool.query(teacherQueries.deleteCurrentTeacherTime,[user_id,teacher_id],(error,results) =>{
            if(error){
                res.status(500).json({result:{msg : error , isComplete:false}});
            }else if(results){
                if(teacher_obj.teacherTime_arry != undefined && teacher_obj.teacherTime_arry.length > 0){
                    teacher_obj.teacherTime_arry.forEach((timeTable, index, array) => {
                        let stream_id = timeTable.stream_id;
                        let class_id = timeTable.class_id;
                        let subrole_id = timeTable.subrole_id;
                         pool.query(teacherQueries.updateTeacherTimeInfo,[teacher_id,user_id,stream_id,class_id,subrole_id], (error,results) =>{
                            if(error){
                                res.status(500).json({result:{msg : error , isComplete:false}});
                            }else{
                                if(index === array.length - 1){
                                    pool.query(teacherQueries.getTeacherTimeInfo,[teacher_id],(error,results) =>{
                                        if(error){
                                            res.status(500).json({result:{msg : error , isComplete:false}});
                                        }else{
                                            teachertime_id = results.rows[0].concatenated_ids;
                                            if(teachertime_id == null){
                                                teacher_id = " ";
                                            }
                                            pool.query(teacherQueries.updateTeacherInfoTeacherTable,
                                                [user_id,email,teacher_name,dob,aadhar_no,teacher_info,hire_date,bdg,mobileno,teachertime_id], 
                                                (error,results) =>{
                                                if(error){
                                                    res.status(500).json({result:{msg : error , isComplete:false}});
                                                }else{
                                                    pool.query(teacherQueries.updateTeacherInfoinUser,[user_id,email,photo],(error,result) =>{
                                                            if(error){
                                                                res.status(500).json({result:{msg : error , isComplete:false}});
                                                            }else{
                                                                res.status(200).json({result:{data : result.rowCount, msg : "Teacher Details Updated Successfully",isComplete:true}});
                                                            }
                                                    })
                                                }
                                            }) 
                                        }
                                    })
                                }
                            }
                        })
                    });
                }else{
                    res.status(500).json({result:{msg : "timeTable of teacher is required" , isComplete:false}});            
                }
            }
        });
    }else{
        res.status(500).json({result:{msg : error , isComplete:false}});
    }
}

function updateTeacherInfoWithoutTime(req,res) {
    const { s_role_id,s_user_id,user_id,teacher_id ,teacher_obj } = req;
    if(teacher_obj != undefined && teacher_obj != null && teacher_obj != ""){
        let email = teacher_obj.email;
        let teacher_name = teacher_obj.teacher_name;
        let dob = teacher_obj.dob;
        let aadhar_no = teacher_obj.aadhar_no;
        let teacher_info = teacher_obj.teacher_info;
        let hire_date = teacher_obj.hire_date;
        let bdg = teacher_obj.bdg;
        let mobileno = teacher_obj.mobileno;
        let photo = teacher_obj.photo;
        let teachertime_id = "";
        pool.query(teacherQueries.getTeacherTimeInfo,[teacher_id],(error,results) =>{
            if(error){
                res.status(500).json({result:{msg : error , isComplete:false}});
            }else{
                teachertime_id = results.rows[0].concatenated_ids;
                if(teachertime_id == null){
                    teacher_id = " ";
                }
                pool.query(teacherQueries.updateTeacherInfoTeacherTable,
                    [user_id,email,teacher_name,dob,aadhar_no,teacher_info,hire_date,bdg,mobileno,teachertime_id], 
                    (error,results) =>{
                    if(error){
                        res.status(500).json({result:{msg : error , isComplete:false}});
                    }else{
                        pool.query(teacherQueries.updateTeacherInfoinUser,[user_id,email,photo],(error,result) =>{
                                if(error){
                                    res.status(500).json({result:{msg : error , isComplete:false}});
                                }else{
                                    res.status(200).json({result:{data : result.rowCount, msg : "Teacher Details Updated Successfully",isComplete:true}});
                                }
                        })
                    }
                }) 
            }
        })
    }else{
        res.status(500).json({result:{msg : error , isComplete:false}});
    }
}

module.exports = {
    updateTeacherInfoWithTime,
    updateTeacherInfoWithoutTime
};