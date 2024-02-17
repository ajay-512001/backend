const authRouter = require('express')
const authController = require('./authController')
const authrouter = authRouter();

authrouter.post('/signIn', authController.authSignIn);

authrouter.post('/signUp', authController.authSignUp);


module.exports = authrouter;