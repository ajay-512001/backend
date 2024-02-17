const pool = require("../../db");
const studentQueries = require("./studentQueries");

const getStudentList = (req,res)  => {
    const { s_role_id,s_user_id } = req.body;
            pool.query(studentQueries.getStudentList, (error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                    res.status(200).json({result:{data : results.rows, msg : "User Found Successfully",isComplete:true}});
                }
            })
}

const getStudentInfo = (req,res)  => {
    const { s_role_id,s_user_id,user_id } = req.body;
            pool.query(studentQueries.getStudentInfo,[user_id], (error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                            res.status(200).json({result:{data : results.rows[0], msg : "User Found Successfully",isComplete:true}});      
                        }
            })
}

const updatestudentInfo = (req,res)  => {
    const { s_role_id,s_user_id,user_id,student_id ,student_obj } = req.body;
    if(student_obj != undefined && student_obj != null && student_obj != ""){
        let email = student_obj.email;
        let student_name = student_obj.student_name;
        let dob = student_obj.dob;
        let aadhar_no = student_obj.aadhar_no;
        let student_info = student_obj.student_info;
        let enroll_date = student_obj.enroll_date;
        let bdg = student_obj.bdg;
        let mobileno = student_obj.mobileno;
        let photo = student_obj.photo;
        let stream_id = student_obj.stream_id;
        let class_id = student_obj.class_id;
        let subrole_id = student_obj.subrole_id;
        pool.query(studentQueries.updateTeacherInfoStudentTable,
            [user_id,email,student_name,dob,aadhar_no,student_info,enroll_date,bdg,mobileno,stream_id,class_id,subrole_id], 
            (error,results) =>{
            if(error){
                console.log(error);
                res.status(500).json({result:{msg : error , isComplete:false}});
            }else{
                pool.query(studentQueries.updateStudentInfoinUser,[user_id,email,photo],(error,result) =>{
                        if(error){
                            console.log(error)
                            res.status(500).json({result:{msg : error , isComplete:false}});
                        }else{
                            res.status(200).json({result:{data : result.rowCount, msg : "student Details Updated Successfully",isComplete:true}});
                        }
                })
            }
        })
    }else{
        res.status(500).json({result:{msg : error , isComplete:false}});
    }
}


module.exports = {
    getStudentList,
    getStudentInfo,
    updatestudentInfo
};