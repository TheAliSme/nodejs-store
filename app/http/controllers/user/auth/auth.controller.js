const createErrors = require("http-errors")
const { UserModel } = require("../../../../models/users")
const { EXPIRES_IN, USER_ROLE } = require("../../../../utils/constans")
const { RandomNumberGeneratot } = require("../../../../utils/functions")
const { authSchema } = require("../../../validators/user/auth.schema")
const Controller = require("../../controller")

class UserAuthController extends Controller{
    async login(req,res,next){
        try {
            await authSchema.validateAsync(req.body);
            const {mobile} = req.body;
            const code = RandomNumberGeneratot()
            const result = await this.saveUser(mobile,code)
            console.log(result)
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
            next(createErrors.BadRequest(error.message))
        }
    }
    async saveUser(mobile,code){
        let otp = {
            code,
            expiresIn : EXPIRES_IN
        }
        const result = await this.checkExistUser(mobile);
        if(result){
            return (await this.updateUser(mobile,{otp}))
        }
        return !!(await UserModel.create({
            mobile,
            otp,
            Roles : [USER_ROLE]
        }))
    }
    async checkExistUser(mobile){
        const user = UserModel.findOne({mobile})
        return !!user
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