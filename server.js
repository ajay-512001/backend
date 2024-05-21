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

app.use(express.json({ limit: '10mb' })); // Set the limit based on your requirements
app.use(helmet());

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

app.listen(port, ()=> console.log('app is listining on port 3000'))