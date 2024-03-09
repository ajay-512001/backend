const pool = require("../../db");
const commonQueries = require("./commonQueries");
const fs = require('fs');
const excelTojson = require('convert-excel-to-json');
const teacherFunction = require("../teacher/teacherFunction");

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

async function excelUpload(req,res) {
    try {
        var matches = req.file.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.*)$/);
        var base64Data = matches[2];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        let fileName = req.fileName || "ajay.xlsx";
        let filePath =  "./temp/" + fileName;
        fs.writeFileSync(filePath, imageBuffer, 'utf8');
         const excleData = excelTojson({
                sourceFile : filePath,
                header:{
                    rows : 1
                },
                columnToKey:{
                    "*" : "{{columnHeader}}",
                }
            });
            fs.unlinkSync(filePath); 
        await teacherFunction.processAndInsertDataOfStudent(excleData.Sheet1);  
        res.status(200).json({result:{msg : "Excel data inserted successfully." , isComplete:true }});
    } catch (error) {
        console.error('Error uploading Excel:', error);
        res.status(500).json({result:{msg : "Internal server error." , isComplete:false }});  
    }
}


module.exports = {
    getSubRoles,
    getClassRoles,
    getStreamRoles,
    getRoles,
    excelUpload
};