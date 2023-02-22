const createErrors = require("http-errors")
const { UserModel } = require("../../../../models/users")
const { EXPIRES_IN, USER_ROLE } = require("../../../../utils/constans")
const { RandomNumberGeneratot, SignAccessToken, VerifyRefreshToken, SignRefreshToken } = require("../../../../utils/functions")
const { checkOtpSchema, getOtpSchema } = require("../../../validators/user/auth.schema")
const Controller = require("../../controller")

class UserAuthController extends Controller{
    async getOtp(req,res,next){
        try {
            await getOtpSchema.validateAsync(req.body);
            const {mobile} = req.body;
            const code = RandomNumberGeneratot()
            const result = await this.saveUser(mobile,code)
            if(!result) throw createErrors.Unauthorized("login failled")
            return res.status(200).send({
                data : {
                    statusCode : 200,
                    message : "the OTP code was sended for you",
                    code,
                    mobile
                }
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async checkOtp(req,res,next){
        try {
            await checkOtpSchema.validateAsync(req.body)
            const { mobile, code } = req.body;
            const user = await UserModel.findOne({ mobile }, { password: 0, refreshToken: 0, accessToken: 0})
            if (!user) throw createErrors.NotFound("کاربر یافت نشد")
            if (user.otp.code != code) throw createErrors.Unauthorized("کد ارسال شده صحیح نمیباشد");
            const now = (new Date()).getTime();
            if (+user.otp.expiresIn < now) throw createErrors.Unauthorized("کد شما منقضی شده است");
            const accessToken = await SignAccessToken(user._id)
            const refreshToken = await SignRefreshToken(user._id);
            return res.json({
              data: {
                accessToken,
                refreshToken
              }
            })
          } catch (error) {
            next(error)
          }
    }
    async refreshToken(req,res,next){
        try {
            const {refreshToken} = req.body;
            const mobile = await VerifyRefreshToken(refreshToken);
            const user = await UserModel.findOne({mobile})
            const accessToken = await SignAccessToken(user._id)
            const newRefreshToken = await SignRefreshToken(user._id)
            return res.json({
                data : {
                    accessToken,
                    refreshToken : newRefreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async saveUser(mobile,code){
        let otp = {
            code,
            expiresIn : (new Date().getTime() + 120000)
        }
        const result = await this.checkExistUser(mobile);
        if(result){
            return (await this.updateUser(mobile,{otp}))
        }
        return (await UserModel.create({
            mobile,
            otp,
            Roles : [USER_ROLE]
        }))
    }
    async checkExistUser(mobile){
        const user = UserModel.findOne({mobile})
        return user
    }
    async updateUser(mobile,objectData = {}){
        Object.keys(objectData).forEach(key => {
            if([""," ",0,NaN,undefined,null,"0"].includes(objectData[key])) delete objectData[key] 
        })
        const updateResult = await UserModel.updateOne({mobile},{$set : objectData})
        return !!updateResult.modifiedCount
    }
}
module.exports = {
    UserAuthController : new UserAuthController()
}