const {Users} = require("../models/associations");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");


async function authenticateUser(req,res,next){
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token,"JustASecretKey");
        const userId = decoded.userId;
        
        const user = await Users.findOne({where:{id:userId}});
        if(user){
            req.userId = userId;
            next();
        }else{
            return sendResponse.notAuthorized(res,"Unauthorized User!");
        }
        
    } catch (error) {
        console.log("Error authenticateUser",error.message);
        return sendResponse.serverError(res,"Authorization failed")
    }
}

module.exports = {
    authenticateUser
}