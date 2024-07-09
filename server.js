const express = require('express');
const studentRoutes = require("./src/student/studentRoutes");
const authRoutes = require("./src/auth/authRoutes");
const adminRoutes = require("./src/admin/adminRoutes");
const teacherRoutes = require("./src/teacher/teacherRoutes");
const commonRoutes = require("./src/common/commonRoutes");
const testRoutes = require("./testing");
const app = express();
const port = 3000;
const auth = require("./src/middleware/auth")
const cors = require('cors');
const helmet = require("helmet");
const { exec } = require('child_process');

app.use(express.json({ limit: '10mb' })); // Set the limit based on your requirements
app.use(helmet());

let isDisconnect = true
let server;

//cors defined 
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" )
    next();
});

app.get("/", (req,res) => {
    res.send("server started")
})

app.use('/api/v1/auth', auth.authentication, authRoutes);

app.use('/api/v1/student', auth.authToken, studentRoutes);

app.use('/api/v1/admin', auth.authToken, adminRoutes);

app.use('/api/v1/teacher', auth.authToken, teacherRoutes);

app.use('/api/common', auth.authToken, commonRoutes);

app.use('/', testRoutes);

server = app.listen(port, ()=> {console.log('app is listining on port 3000'), isDisconnect = false;})

   

/* Restarting server on any crash automatically */


process.on('exit', (code) => {
  console.log(`Process exited with code ${code}`);
  from = "crashed";
  notifyName = "crashed";
  console.log(isDisconnect);
  if(!isDisconnect){
    restartTerminal(from,notifyName);
  }
});

const restartTerminal = (from,notifyName) => {
  const filePath = 'cachenerror.js';
  let date = new Date();
  const fileContent = `//service was restarted by ${from} with Notify Name ${notifyName} at ${date}.`;

  const command =  `@echo ${fileContent} >> ${filePath} 2> nul`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Error saving file:', err);
    } else {
      console.log('File saved successfully:', filePath);
    }
  }); 
};