const nodemailer = require("nodemailer");
const mailConfig = require("../../mailConfig");
const pool = require("../../db");
const fs = require('fs');

async function sendNotificationRequest(req,emailType) {
  
  const isOnlineModule = await import('is-online');
  const isOnline = isOnlineModule.default || isOnlineModule;
  const online = await isOnline();
  if (online) {
      sendMailNotification(req,emailType);
  } else {
      console.log('Internet is not working');
      if(!req.update){
        pool.query("INSERT INTO SendNotificationEmail(email_id, email_from, email_to, response,emailtype,emailtemplate,ispending) VALUES ($1,$2,$3,$4,$5,$6,$7)" ,[null,"ajaygajjarkar512001@gmail.com",req.email,null,emailType,null,0], (error,results) =>{
        })
      }
  }
};


async function sendMailNotification(req,emailType){
  var emailTemplate;
  var dynamicData;
  var FormatedEmailTemplate;
  const currentDate = new Date();
  let formatDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;


  /* create dynamic data according to need - start. */

  if(emailType == "signup"){
    emailTemplate = fs.readFileSync('src/mail/template/signupTemplate.html', 'utf-8');
    dynamicData = {
      userName: req.user_name,
      date: formatDate,
      email: req.email,
      subject :"You successfully registered with Wolfweb Organition."
    };
    FormatedEmailTemplate =  emailTemplate.replace(/{{userName}}/g, dynamicData.userName).replace(/{{date}}/g, dynamicData.date).replace(/{{email}}/g, dynamicData.email);
  }else if(emailType == "cangerole"){
      emailTemplate = fs.readFileSync('src/mail/template/changeRole.html', 'utf-8');
      req.roleName = req.roleName.toUpperCase();
      dynamicData = {
        userName: req.username,
        date: formatDate,
        email: req.email,
        roleName : req.roleName,
        subject :"Your Role Change in Wolfweb Organition."
      };
      FormatedEmailTemplate =  emailTemplate.replace(/{{userName}}/g, dynamicData.userName).replace(/{{date}}/g, dynamicData.date).replace(/{{email}}/g, dynamicData.email).replace(/{{roleName}}/g, dynamicData.roleName);
  }else if (emailType == "invoice"){
      emailTemplate = fs.readFileSync('src/mail/template/changeRole.html', 'utf-8');
      req.roleName = req.roleName.toUpperCase();
      dynamicData = {
        userName: req.username,
        date: formatDate,
        email: req.email,
        roleName : req.roleName,
        subject :"Your Transaction Update."
      };
      FormatedEmailTemplate =  emailTemplate.replace(/{{userName}}/g, dynamicData.userName).replace(/{{date}}/g, dynamicData.date).replace(/{{email}}/g, dynamicData.email).replace(/{{roleName}}/g, dynamicData.roleName);
  }

  /* create dynamic data according to need - end. */


  /* Start smtp Server - start */

  let testAccount = await nodemailer.createTestAccount();
  let transporter = await nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gnail.com",
    port: 587,
    secure: false,
    auth: {
        user: mailConfig.UserName,
        pass: mailConfig.PassWord
    },
  });

  /* Start smtp Server - end */


  /* send email according to attach file or not - start */

  let info;
  if(emailType == "invoice"){
    const pdfBuffer = fs.readFileSync('src/pdf/docs/invoices/first_invoice.pdf');
    info = await transporter.sendMail({
      from: {
        name: mailConfig.SenderName,
        address : mailConfig.UserName
      },
      to: [req.email],
      subject: dynamicData.subject,
      html: FormatedEmailTemplate,
      attachments : [
        {
          filename : "yourInvoice.pdf",
          content : pdfBuffer
        }
      ]
    });
  }else{
    info = await transporter.sendMail({
      from: {
        name: mailConfig.SenderName,
        address : mailConfig.UserName
      },
      to: [req.email],
      subject: dynamicData.subject,
      html: FormatedEmailTemplate,
    });
  }

  /* send email according to attach file or not - end */


  /* entry in the database - start */

  info.envelope.to.forEach(e => {
    if(!req.update){
      pool.query("INSERT INTO SendNotificationEmail(email_id, email_from, email_to, response,emailtype,emailtemplate,ispending) VALUES ($1,$2,$3,$4,$5,$6,$7)" ,[info.messageId,info.envelope.from,e,info.response,emailType,FormatedEmailTemplate,1], (error,results) =>{
      })  
    }else{
      pool.query("update SendNotificationEmail set email_id = $1, email_from = $2, email_to = $3, response = $4,emailtype = $5,emailtemplate = $6,ispending = $7 where notif_id = $8" ,[info.messageId,info.envelope.from,e,info.response,emailType,FormatedEmailTemplate,1,req.id], (error,results) =>{
      })
    }
  })

  /* entry in the database - end */
}

module.exports = {sendNotificationRequest};