const pool = require("../../db");
const teacherQueries = require("./teacherQuery");
const teacherFunction = require("./teacherFunction");


const getTeacherList = (req,res)  => {
    const { s_role_id,s_user_id } = req.body;
            pool.query(teacherQueries.getTeacherList, (error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                    res.status(200).json({result:{data : results.rows, msg : "User Found Successfully",isComplete:true}});
                }
            })
}

const getTeacherInfo = (req,res)  => {
    const { s_role_id,s_user_id,user_id } = req.body;
            pool.query(teacherQueries.getTeacherInfo,[user_id], (error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                    pool.query(teacherQueries.getTimeInfo,[user_id], (error,resultArry) =>{
                        if(error){
                            res.status(500).json({result:{msg : error , isComplete:false}});
                        }else{
                            let Arry = resultArry.rows;
                            results.rows[0]["teacherTime_arry"] = Arry;
                            res.status(200).json({result:{data : results.rows[0], msg : "User Found Successfully",isComplete:true}});      
                        }
                    })
                }
            })
}

const updateTeacherInfo = (req,res)  => {
    if(req.body.action == "withtime"){
        teacherFunction.updateTeacherInfoWithTime(req.body,res);
    }else{
        teacherFunction.updateTeacherInfoWithoutTime(req.body,res);
    }
}

module.exports = {
    getTeacherList,
    getTeacherInfo,
    updateTeacherInfo
};