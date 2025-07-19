const sendResponse = require("../utils/sendResponse");
const User = require("../models/Users");


async function createUser(req,res){
    try {
        const {userName,email,password} = req.body;
        let user = await User.findOne({where:{email}});
        if(user){
            console.log("Error: createUser",error.message);
            return sendResponse.badRequest(res,"Email Id already used")
        }

        user = {
            userName,
            email,
            password
        }

        const createdUser = await User.create(user);
        return sendResponse.created(res,"User created!",createdUser);

    } catch (error) {
        console.log("Error: createUser",error.message);
        sendResponse.serverError(res,"Server Error: User signup failed!")
    }
}

module.exports = {
    createUser
}