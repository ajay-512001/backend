const jwt = require("jsonwebtoken");
const SECRET_KEY = 'ajayishere12345';


const authToken = (req,res,next) =>{    
    try {
        let token = req.header('Authorization');
        if(token){
            token = token.split(" ")[1];
            let user = jwt.verify(token, SECRET_KEY);
            req.userId = user.master_user_id;
            next();
        }
        else{
            res.status(401).json({result:{msg : "Unathorized User" , isComplete:false}});
        }
    } 
    catch (error) {
        res.status(401).json({result:{msg : "Unathorized User" , isComplete:false}});
    }
}


const authentication = (req,res,next) =>{
    const apikey = req.header('Api_secret_key');
  
    if(!apikey || apikey != SECRET_KEY){
      return res.status(401).json({result:{msg : "Unathorized User" , isComplete:false}})
     }
    else{ 
      next();
    }
}


module.exports = {
    authToken,
    authentication
};