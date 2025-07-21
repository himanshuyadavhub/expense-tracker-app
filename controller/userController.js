const sendResponse = require("../utils/sendResponse");
const {Users} = require("../models/associations");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function createUser(req,res){
    try {
        const {userName,email,password} = req.body;
        let user = await Users.findOne({where:{email}});
        if(user){
            return sendResponse.badRequest(res,"Email Id already used")
        }
        const hash = await bcrypt.hash(password,10);
        user = {
            userName,
            email,
            password:hash
        }

        const createdUser = await Users.create(user);
        return sendResponse.created(res,"User created!",createdUser);

    } catch (error) {
        console.log("Error: createUser",error.message);
        sendResponse.serverError(res,"Server Error: User signup failed!")
    }
}

async function loginUser(req,res){
    try {
        const {email,password} = req.body;
        const user = await Users.findOne({where:{email}});
        if(!user){
            return sendResponse.notFound(res,"Email not registered!")
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return sendResponse.notAuthorized(res,"Incorrect password!");
        }
        const token = jwt.sign({userId:user.id},"JustASecretKey")
        return sendResponse.ok(res,"User logged In",{token});
    } catch (error) {
        console.log("Error: loginUser",error.message);
        sendResponse.serverError(res,"Server Error: User login failed!")
    }
}



module.exports = {
    createUser,
    loginUser
}