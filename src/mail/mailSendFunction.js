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
  }
};


async function sendMailNotification(req,emailType){
  var emailTemplate;
  var dynamicData;
  var FormatedEmailTemplate;
  const currentDate = new Date();
  let formatDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

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
  }

  let testAccount = await nodemailer.createTestAccount();
  //connect with the smtp
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


  let info = await transporter.sendMail({
    from: {
      name: mailConfig.SenderName,
      address : mailConfig.UserName
    },
    to: [req.email],
    subject: dynamicData.subject,
    html: FormatedEmailTemplate
  });

  info.envelope.to.forEach(e => {
    pool.query("INSERT INTO SendNotificationEmail(email_id, email_from, email_to, response,emailtype,emailtemplate) VALUES ($1,$2,$3,$4,$5,$6)" ,[info.messageId,info.envelope.from,e,info.response,emailType,FormatedEmailTemplate], (error,results) =>{
    })
  })
}

module.exports = {sendNotificationRequest};