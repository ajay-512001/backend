const pool = require("../../db");
const authQueries = require("./authQueries");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'ajayishere12345';
const sendMailFunction = require("../mail/mailSendFunction");


const authSignUp = async (req,res)  => {
    const { user_name, email, password } = req.body;
    try {
       pool.query(authQueries.checkEmailExits, [email], (error, result) => {
            if (!result.rows.length) {

                pool.query(authQueries.checkUserExits, [user_name], async (error,result) => {
                    if(!result.rows.length){
                       
                        const hashPassword = await bcrypt.hash(password, saltRounds);
                        pool.query(authQueries.addUser,[user_name, email, hashPassword], (error, result) => {
                            if(error) {
                                res.status(500).json({result:{msg : "Something went wrong at " + authQueries.addUser,isComplete:false}});
                                throw error;
                            }else{
                                pool.query(authQueries.getUserByEmail,[email], (error, result) => {
                                    if(error) {
                                        res.status(500).json({result:{msg : "Something went wrong at " + authQueries.getUserByEmail,isComplete:false}});
                                        throw error;
                                    }
                                    else{
                                        const results = result.rows[0];
                                        const token = jwt.sign({email : results.email, id : results.master_user_id},SECRET_KEY);
                                        res.status(200).json({result:{data : results, token : token, msg : "User created Successfully",isComplete:true}});
                                        sendMailFunction.sendNotificationRequest(req.body,"signup")
                                    }
                                });
                            }
                        });
                        
                    }else{
                        return res.status(213).json({result:{msg:"User Name Already Exists. Try with different User Name.",isComplete:false}});
                    }
                });
                
            }else{
                return res.status(212).json({ result: { msg: "User Email Already Exists. Try with different Email.",isComplete:false} });
            }
        });

    } catch (error) {
        return res.status(500).json({result:{msg:"server encountered error.", error: error,isComplete:false}});
    }
}



const authSignIn = async (req,res)  => {
    const { email, password, user_name } = req.body;

   try {
    pool.query(authQueries.getUser, [email,user_name], async (error, result) => {
        if (result.rows.length) {
            const matchPaswd = await bcrypt.compare(password, result.rows[0].password);
            if(!matchPaswd){
                return res.status(201).json({ result: { msg: "Inavalid credential.", isComplete:false} });
            }else{
                const token = jwt.sign({email : result.rows[0].email, id : result.rows[0].master_user_id},SECRET_KEY);
                res.status(200).json({result:{data : result.rows[0], token : token, msg : "User signedin Successfully",isComplete:true}});
                //sendMailFunction.sendNotificationRequest(req.body,"signup")
            }
        }else{
            res.status(211).json({ result: { msg: "User not exists with this email or user name.",isComplete:false} });
            return;
        }
    });
   }
    catch (error) {
    return res.status(500).json({result:{msg:"server encountered error.", error: error,isComplete:false}});
   }

}



module.exports = {
    authSignIn,
    authSignUp
};