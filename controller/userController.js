const sendResponse = require("../utils/sendResponse");
const User = require("../models/Users");
const bcrypt = require('bcrypt');


async function createUser(req,res){
    try {
        const {userName,email,password} = req.body;
        let user = await User.findOne({where:{email}});
        if(user){
            return sendResponse.badRequest(res,"Email Id already used")
        }
        const hash = await bcrypt.hash(password,10);
        user = {
            userName,
            email,
            password:hash
        }

        const createdUser = await User.create(user);
        return sendResponse.created(res,"User created!",createdUser);

    } catch (error) {
        console.log("Error: createUser",error.message);
        sendResponse.serverError(res,"Server Error: User signup failed!")
    }
}

async function loginUser(req,res){
    try {
        const {email,password} = req.body;
        const user = await User.findOne({where:{email}});
        if(!user){
            return sendResponse.notFound(res,"Email not registered!")
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return sendResponse.notAuthorized(res,"Incorrect password!");
        }
        return sendResponse.ok(res,"User logged In",user);
    } catch (error) {
        console.log("Error: loginUser",error.message);
        sendResponse.serverError(res,"Server Error: User login failed!")
    }
}

module.exports = {
    createUser,
    loginUser
}