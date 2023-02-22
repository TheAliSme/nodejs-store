const joi = require("@hapi/joi");

const getOtpSchema = joi.object({
    mobile : joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error("the mobile phone is not correct")),
}) 
const checkOtpSchema = joi.object({
    mobile : joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error("the mobile phone is not correct")),
    code : joi.string().min(4).max(6).error(new Error("the OTP code is not correct"))
}) 

module.exports = {
    getOtpSchema,
    checkOtpSchema
}