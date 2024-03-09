const pool = require("../../db");
const adminQueries = require("./adminQuery");
const sendMailFunction = require("../mail/mailSendFunction");


const getUserList = (req,res)  => {
    const { s_role_id,s_user_id,role_id } = req.body;
            if(role_id){
                pool.query(adminQueries.getUserListquerbyRole ,[role_id], (error,results) =>{
                    if(error){
                        res.status(500).json({result:{msg : error , isComplete:false}});
                    }else if(results.rows.length){
                        res.status(200).json({result:{data : results.rows, msg : "User Found Successfully",isComplete:true}});
                    }
                })
            }else{
                pool.query(adminQueries.getUserListquer , (error,results) =>{
                    if(error){
                        res.status(500).json({result:{msg : error , isComplete:false}});
                    }else if(results.rows.length){
                        res.status(200).json({result:{data : results.rows, msg : "User Found Successfully",isComplete:true}});
                    }
                })
            }
}

const getAdminList = (req,res)  => {
    const { s_role_id,s_user_id } = req.body;
            pool.query(adminQueries.getAdminList , (error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                    res.status(200).json({result:{data : results.rows, msg : "User Found Successfully",isComplete:true}});
                }
            })
}

const getUserRoleInfoById = (req,res)  => {
    const { user_id,role_id,s_role_id,s_user_id } = req.body;
       pool.query(adminQueries.getUserByUserIdRoleId ,[s_user_id , s_role_id] , (err,results) =>{
        if(results.rows.length){
            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (error,results) =>{
                if(error) throw error;
                res.status(200).json({result:{data : results.rows[0], msg : "User Found Successfully",isComplete:true}});
            })
        }else{
            res.status(200).json({res:{msg : "you are not a permitted user.",isComplete:false}});
        }
       })
}

const updateUserRoleInfoById = (req,res)  => {
    const { user_id,s_user_id,s_role_id, email, username, role_id,photo } = req.body;

    pool.query(adminQueries.getUserByUserIdRoleId ,[s_user_id , s_role_id] , (err,results) =>{
        let fiveHoundred = 0;
        if(results.rows.length){
            pool.query(adminQueries.updatUserInfo ,[role_id,username, email,user_id,photo,s_user_id], (error, results) => {
                if(error){
                res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                 
                }else{ 
                    if(role_id == 0 || role_id == '0' || role_id == 4 || role_id == '4'){
                        pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                            res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                            sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                        })
                    }
                    
                     //1. we have to check if it is presented in any other table - admin
                    if(role_id == 1 || role_id == '1'){
                        pool.query(adminQueries.checkUserPresenceInAdmin ,[user_id], (error, results) => {
                            if(error){
                                res.status(500).json({result:{msg : "something went wrong1",isComplete:false}});
                                fiveHoundred += 1;
                            }else{
                                if(results.rows.length){
                                    if(results.rows[0].isactive){
                                        pool.query(adminQueries.updateadmin ,[ email ,user_id], (error, results) => {
                                            if(error){
                                                res.status(500).json({result:{msg : "something went wrong16",isComplete:false}});
                                                fiveHoundred += 1;
                                            }
                                        });
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong15",isComplete:false}}); 
                                        }
                                    }else{
                                        pool.query(adminQueries.updateStatusadmin ,[user_id,'true'], (error, results) => {
                                            if(error){
                                                res.status(500).json({result:{msg : "something went wrong2",isComplete:false}});
                                                fiveHoundred += 1;
                                            }
                                        })
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.updateStatusstudent ,[user_id,'false'], (error, results) => {
                                                if(error){
                                                    res.status(500).json({result:{msg : "something went wrong3",isComplete:false}});
                                                    fiveHoundred += 1;     
                                                }
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong4",isComplete:false}}); 
                                        }
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.updateStatusteacher ,[user_id,'false'], (error, results) => {
                                                if(error){
                                                    res.status(500).json({result:{msg : "something went wrong5",isComplete:false}}); 
                                                    fiveHoundred += 1; 
                                                }
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong6",isComplete:false}}); 
                                        }
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong7",isComplete:false}}); 
                                        }
                                    }
                                }else{
                                    pool.query(adminQueries.insertAdmin ,[user_id,username,role_id,email,'true'], (error, results) => {
                                        if(error){
                                            res.status(500).json({result:{msg : "something went wrong8",isComplete:false}});
                                            fiveHoundred += 1;  
                                        }else{
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.updateStatusstudent ,[user_id,'false'], (error, results) => {
                                                    if(error){
                                                        res.status(500).json({result:{msg : "something went wrong9",isComplete:false}});
                                                        fiveHoundred += 1;     
                                                    }
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong10",isComplete:false}}); 
                                            }
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.updateStatusteacher ,[user_id,'false'], (error, results) => {
                                                    if(error){
                                                        res.status(500).json({result:{msg : "something went wrong11",isComplete:false}}); 
                                                        fiveHoundred += 1; 
                                                    }
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong12",isComplete:false}}); 
                                            }
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                    res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                    sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong13",isComplete:false}}); 
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }

                    //2. we have to check if it is presented in any other table - teacher
                    if(role_id == 2 || role_id == '2'){
                        pool.query(adminQueries.checkUserPresenceInTeacher ,[user_id], (error, results) => {
                            if(error){
                                console.log(error)
                                res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                                fiveHoundred += 1;
                            }else{
                                if(results.rows.length){
                                    if(results.rows[0].isactive){
                                        pool.query(adminQueries.updateteacher ,[ email ,user_id], (error, results) => {
                                            if(error){
                                                res.status(500).json({result:{msg : "something went wrong15",isComplete:false}});
                                                fiveHoundred += 1;
                                            }
                                        });
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong7",isComplete:false}}); 
                                        }
                                    }else{
                                        pool.query(adminQueries.updateStatusteacher ,[user_id,'true'], (error, results) => {
                                            if(error){
                                                res.status(500).json({result:{msg : "something went wrong1",isComplete:false}});
                                                fiveHoundred += 1;
                                            }
                                        })
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.updateStatusstudent ,[user_id,'false'], (error, results) => {
                                                if(error){
                                                    res.status(500).json({result:{msg : "something went wrong2",isComplete:false}});
                                                    fiveHoundred += 1;     
                                                }
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong3",isComplete:false}}); 
                                        }
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.updateStatusadmin ,[user_id,'false'], (error, results) => {
                                                if(error){
                                                    res.status(500).json({result:{msg : "something went wrong4",isComplete:false}}); 
                                                    fiveHoundred += 1; 
                                                }
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong5",isComplete:false}}); 
                                        }
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong6",isComplete:false}}); 
                                        }
                                    }
                                }else{
                                    pool.query(adminQueries.insertTeacher ,[user_id,username,role_id,email,'true'], (error, results) => {
                                        if(error){
                                            res.status(500).json({result:{msg : "something went wrong7",isComplete:false}});
                                            fiveHoundred += 1;  
                                        }else{
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.updateStatusstudent ,[user_id,'false'], (error, results) => {
                                                    if(error){
                                                        res.status(500).json({result:{msg : "something went wrong8",isComplete:false}});
                                                        fiveHoundred += 1;     
                                                    }
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong9",isComplete:false}}); 
                                            }
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.updateStatusadmin ,[user_id,'false'], (error, results) => {
                                                    if(error){
                                                        res.status(500).json({result:{msg : "something went wrong10",isComplete:false}}); 
                                                        fiveHoundred += 1; 
                                                    }
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong11",isComplete:false}}); 
                                            }
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                    res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                    sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong12",isComplete:false}}); 
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                    
                    //3. we have to check if it is presented in any other table - student
                    if(role_id == 3 || role_id == '3'){
                        pool.query(adminQueries.checkUserPresenceInStudent ,[user_id], (error, results) => {
                            if(error){
                                res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                                fiveHoundred += 1;
                            }else{
                                if(results.rows.length){
                                    if(results.rows[0].isactive){
                                        pool.query(adminQueries.updatestudent ,[ email ,user_id], (error, results) => {
                                            if(error){
                                                res.status(500).json({result:{msg : "something went wrong15",isComplete:false}});
                                                fiveHoundred += 1;
                                            }
                                        });
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong7",isComplete:false}}); 
                                        }
                                    }else{
                                        pool.query(adminQueries.updateStatusstudent ,[user_id,'true'], (error, results) => {
                                            if(error){
                                                res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                                                fiveHoundred += 1;
                                            }
                                        })
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.updateStatusadmin ,[user_id,'false'], (error, results) => {
                                                if(error){
                                                    res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                                                    fiveHoundred += 1;     
                                                }
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                        }
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.updateStatusteacher ,[user_id,'false'], (error, results) => {
                                                if(error){
                                                    res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                                    fiveHoundred += 1; 
                                                }
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                        }
                                        if(fiveHoundred == 0){
                                            pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                            })
                                        }else{
                                            res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                        }
                                    }
                                }else{
                                    pool.query(adminQueries.insertStudent ,[user_id,username,role_id,email,'true'], (error, results) => {
                                        if(error){
                                            res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                                            fiveHoundred += 1;  
                                        }else{
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.updateStatusadmin ,[user_id,'false'], (error, results) => {
                                                    if(error){
                                                        res.status(500).json({result:{msg : "something went wrong",isComplete:false}});
                                                        fiveHoundred += 1;     
                                                    }
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                            }
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.updateStatusteacher ,[user_id,'false'], (error, results) => {
                                                    if(error){
                                                        res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                                        fiveHoundred += 1; 
                                                    }
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                            }
                                            if(fiveHoundred == 0){
                                                pool.query(adminQueries.getUserByUserIdRoleId ,[user_id , role_id] , (err,results) =>{
                                                    res.status(200).json({result:{data : results.rows[0], msg : "User updated Successfully",isComplete:true}});
                                                    sendMailFunction.sendNotificationRequest(req.body,"cangerole");
                                                })
                                            }else{
                                                res.status(500).json({result:{msg : "something went wrong",isComplete:false}}); 
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            });
        }
        else{
            res.status(200).json({result:{data : results, msg : "User not found",isComplete:false}});
        }
    });
}

const getAdminInfo = (req,res)  => {
    const { s_role_id,s_user_id,user_id } = req.body;
            pool.query(adminQueries.getAdminInfo,[user_id], (error,results) =>{
                if(error){
                    res.status(500).json({result:{msg : error , isComplete:false}});
                }else if(results.rows.length){
                            res.status(200).json({result:{data : results.rows[0], msg : "User Found Successfully",isComplete:true}});      
                        }
            })
}

const updateAdminInfo = (req,res)  => {
    const { s_role_id,s_user_id,user_id,admin_id ,admin_obj } = req.body;
    if(admin_obj != undefined && admin_obj != null && admin_obj != ""){
        let email = admin_obj.email;
        let admin_name = admin_obj.admin_name;
        let dob = admin_obj.dob;
        let aadhar_no = admin_obj.aadhar_no;
        let admin_info = admin_obj.admin_info;
        let hire_date = admin_obj.hire_date;
        let bdg = admin_obj.bdg;
        let mobileno = admin_obj.mobileno;
        let photo = admin_obj.photo;
        let stream_id = admin_obj.stream_id;
        let class_id = admin_obj.class_id;
        let subrole_id = admin_obj.subrole_id;
        pool.query(adminQueries.updateAdminInfoAdminTable,
            [user_id,email,admin_name,dob,aadhar_no,admin_info,hire_date,bdg,mobileno,stream_id,class_id,subrole_id], 
            (error,results) =>{
            if(error){
                console.log(error)
                res.status(500).json({result:{msg : error , isComplete:false}});
            }else{
                pool.query(adminQueries.updateAdminInfoinUser,[user_id,email,photo],(error,result) =>{
                        if(error){
                            console.log(error)
                            res.status(500).json({result:{msg : error , isComplete:false}});
                        }else{
                            res.status(200).json({result:{data : result.rowCount, msg : "Admin Details Updated Successfully",isComplete:true}});
                        }
                })
            }
        })
    }else{
        res.status(500).json({result:{msg : error , isComplete:false}});
    }
}



module.exports = {
    getUserRoleInfoById,
    updateUserRoleInfoById,
    getUserList,
    getAdminList,
    getAdminInfo,
    updateAdminInfo
};