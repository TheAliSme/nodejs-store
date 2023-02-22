const jwt = require("jsonwebtoken")
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constans")
const createErrors = require("http-errors");
const { UserModel } = require("../../models/users");

function VerifyAccessToken(req,res,next){
    const headers = req.headers;
    const [bearer,token] = headers?.["access-token"]?.split(" ") || []
    if(token && ["bearer","Bearer"].includes(bearer)){
        jwt.verify(token,ACCESS_TOKEN_SECRET_KEY,async(err,payload) => {
            if(err) return next(createErrors.Unauthorized("please login to your accunt"))
            const {mobile} = payload || {}
            const user = await UserModel.findOne({mobile},{password : 0,otp : 0})
            if(!user) return next(createErrors.Unauthorized("accunt not found"))
            req.user = user 
            return next()
        })
    }
    else return next(createErrors.Unauthorized("please login to your accunt"))
}

module.exports = {
    VerifyAccessToken
}