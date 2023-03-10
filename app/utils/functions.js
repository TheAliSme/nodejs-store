const jwt = require("jsonwebtoken");
const createErrors = require("http-errors");
const redisClient = require("./init-redis")
const { UserModel } = require("../models/users");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constans");

function RandomNumberGeneratot(){
    return Math.floor((Math.random() * 90000) + 10000)
}
function SignAccessToken(userId){
    return new Promise(async(resolve,reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expiresIn : "1d"
        };
        jwt.sign(payload,ACCESS_TOKEN_SECRET_KEY,options,(err,token) => {
            if(err) reject(createErrors.InternalServerError("InternalServerError"))
            resolve(token)
        })
    })
}
function SignRefreshToken(userId){
    return new Promise(async(resolve,reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expiresIn : "1y"
        };
        jwt.sign(payload,REFRESH_TOKEN_SECRET_KEY,options,async(err,token) => {
            if(err) reject(createErrors.InternalServerError("InternalServerError"));
            await redisClient.SETEX(String(userId),(365 * 24 * 60 * 60),token);
            resolve(token)
        })
    })
}
function VerifyRefreshToken(token){
    // return new Promise((resolve,reject) => {
    //     jwt.verify(token,REFRESH_TOKEN_SECRET_KEY,async(err,payload) => {
    //         if(err) reject(createErrors.Unauthorized("please login to your accunt"))
    //         const {mobile} = payload || {};
    //         const user = await UserModel.findOne({mobile},{password : 0,otp : 0})
    //         if(!user) reject(createErrors.Unauthorized("accunt not found"))
    //         const refreshToken = await redisClient.get(String(user?._id));
    //         if(token === refreshToken) return resolve(mobile);
    //         reject(createErrors.Unauthorized("login failed"))
    //     })
    // })
    return new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
            if (err) reject(createErrors.Unauthorized("???????? ???????? ???????????? ?????? ????????"))
            const { mobile } = payload || {};
            const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
            if (!user) reject(createErrors.Unauthorized("???????? ???????????? ???????? ??????"))
            const refreshToken = await redisClient.get(String(user?._id));
            if (!refreshToken) reject(createErrors.Unauthorized("???????? ???????? ???? ?????????? ???????????? ?????????? ??????"))
            if (token === refreshToken) return resolve(mobile);
            reject(createErrors.Unauthorized("???????? ???????? ???? ?????????? ???????????? ?????????? ??????"))
        })
    })
}

module.exports = {
    RandomNumberGeneratot,
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken
}