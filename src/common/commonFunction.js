const pool = require("../../db");
const commonQueries = require("./commonQueries");


function getSubRoles(req,res) {
    const { s_role_id,s_user_id ,stream_id } = req;
    pool.query(commonQueries.getsubroles ,(error,results) =>{
        if(error){
            res.status(500).json({result:{msg : error , isComplete:false}});
        }else if(results.rows.length){
            res.status(200).json({result:{data : results.rows, msg : "Sub Roles Found Successfully",isComplete:true}});
        }else {
            res.status(200).json({result:{data : results.rows, msg : "Sub Roles Not Found",isComplete:true}});
        }
    });
}

function getClassRoles(req,res) {
    const { s_role_id,s_user_id ,stream_id } = req;
            pool.query(commonQueries.getClassRoles ,(error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                    res.status(200).json({result:{data : results.rows, msg : "Class Roles Found Successfully",isComplete:true}});
                }else {
                    res.status(200).json({result:{data : results.rows, msg : "Class Roles Not Found",isComplete:true}});
                }
            })
}

function getStreamRoles(req,res) {
    const { s_role_id,s_user_id,role_id } = req;
    pool.query(commonQueries.getStreamRoles, [role_id] ,(error,results) =>{
        if(error){
            res.status(500).json({result:{msg : error , isComplete:false}});
        }else if(results.rows.length){
            res.status(200).json({result:{data : results.rows, msg : "Stream Roles Found Successfully",isComplete:true}});
        }else {
            res.status(200).json({result:{data : results.rows, msg : "Stream Roles Not Found",isComplete:true}});
        }
    })
}

function getRoles(req,res) {
    const { s_role_id,s_user_id } = req;
    pool.query(commonQueries.getRoles, (error,results) =>{
        if(error){
            res.status(500).json({result:{msg : error , isComplete:false}});
        }else if(results.rows.length){
            res.status(200).json({result:{data : results.rows, msg : "Roles Found Successfully",isComplete:true}});
        }
    })
}

module.exports = {
    getSubRoles,
    getClassRoles,
    getStreamRoles,
    getRoles
};