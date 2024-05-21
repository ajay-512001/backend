const pool = require("../../db");
const commonQueries = require("./commonQueries");
const fs = require('fs');
const excelTojson = require('convert-excel-to-json');
const teacherFunction = require("../teacher/teacherFunction");
const pdfFunction = require("../pdf/generatepdf");
const sendNotificationRequest = require("../mail/mailSendFunction");
const whatsappConfig = require("../../whatsappConfig");
const axios = require('axios');

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
        res.status(200).json({result:{data: excleData.Sheet1, msg : "Excel data inserted successfully." , isComplete:true }});
    } catch (error) {
        console.log(error)
        res.status(500).json({result:{msg : "Internal server error." , isComplete:false }});  
    }
}

async function generatePDF(req,res) {
    try{
        let PdfUrl = await pdfFunction.generateInvoicePdf();
        res.status(200).json({result:{data: PdfUrl, msg : "Invoice Generated SuccessFully." , isComplete:true }});
    }catch(error){
        console.log(error)
        res.status(500).json({result:{msg : "Internal server error." , isComplete:false }});  
    }
}

async function getNotifList(req,res) {
    pool.query(commonQueries.sendNotification, (error,results) =>{
        if(error){
            res.status(500).json({result:{msg : error , isComplete:false}});
        }else if(results.rows.length){
            res.status(200).json({result:{data : results.rows, msg : "List Found Successfully",isComplete:true}});
        }
    })
}

async function sendNotifbyId(req,res) {
    try{
        let data = await pool.query(commonQueries.sendNotificationbyId,[req.notif_id]);
        let roleName = await pool.query(commonQueries.findRole,[data.rows[0].email_to]);
        let userName = await pool.query(commonQueries.username,[data.rows[0].email_to]);
        let dynadata = {
            username : userName.rows[0].username,
            email : data.rows[0].email_to,
            roleName : roleName.rows[0].role_name,
            update : true,
            id: req.notif_id
        }
        let dataNotif = await sendNotificationRequest.sendNotificationRequest(dynadata,req.emailType);
        res.status(200).json({result:{data: dataNotif, msg : "EmailSendSuccessfully." , isComplete:true }});
    }catch(error){
        console.log(error)
        res.status(500).json({result:{msg : "Internal server error." , isComplete:false }});  
    }
}

async function sendWhatsapp(req,res) {
    let headers = whatsappConfig.whatsapp_req_header;
    let reqObject;
    let msgTypeApi;
    if(req.type != "media"){
        reqObject = {
            "mobileno": req.mobileno,
            "msg" : req.message,
            "type" : req.type
          }
        msgTypeApi = "sendTextMsg";
    }else{
        reqObject = {
            "mobileno": req.mobileno,
            "file_path" : req.file_path,
            "caption" : req.caption,
            "type" : req.type
          }
        msgTypeApi = "sendMultimedia";
    }  
    try{
        axios.post(whatsappConfig.whatsapp_end_ponit + msgTypeApi, reqObject, { headers })
          .then((response) => {
            if(response.isComplete){
                res.status(200).json({result:{data: req, msg : "Message sent successfully.",serverMsg:response.description , isComplete:true }});
            }else{
                res.status(500).json({result:{msg : "Internal server error." , serverMsg:response.description , isComplete:false }});  
            }
          })
          .catch((error) => {
            res.status(500).json({result:{msg : "Internal server error." , isComplete:false }});  
          }); 
    }catch(error){
        console.log(error)
        res.status(500).json({result:{msg : "Internal server error." , isComplete:false }});  
    }
}

module.exports = {
    getSubRoles,
    getClassRoles,
    getStreamRoles,
    getRoles,
    excelUpload,
    generatePDF,
    getNotifList,
    sendNotifbyId,
    sendWhatsapp
};