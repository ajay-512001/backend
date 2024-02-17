const checkEmailExits = "select s from user_master s where s.email = $1";
const checkUserExits = "select s from user_master s where s.username = $1";
const addUser = "INSERT INTO user_master(username, email, password) VALUES ($1, $2, $3)";
const getUserByEmail = "select * from user_master where email = $1";
const getUser = "select * from user_master where email = $1 and username = $2";

module.exports={
    checkEmailExits,
    checkUserExits,
    addUser,
    getUserByEmail,
    getUser
}