const { UserAuthController } = require("../../http/controllers/user/auth/auth.controller");
const router = require("express").Router(); 

/**
 * @swagger
 *  tags :
 *      name : User-Authentication
 *      description : user-auth section
 */

/**
 * @swagger
 *  /user/get-otp : 
 *      post :
 *          tags : [User-Authentication]
 *          summary : login user in userpanel with phone number
 *          description : one time password (OTP) login
 *          parameters : 
 *          -   name : mobile
 *              description : fa-IRI phone number
 *              in : formData
 *              required : true
 *              type : string
 *          responses : 
 *               201 :
 *                  description : true
 *               400 : 
 *                  description : bad requst
 *               401 : 
 *                  description : unauthorization
 *               500 : 
 *                  description : internall server error
 */

router.post("/get-otp",UserAuthController.getOtp)
/**
 * @swagger
 *  /user/check-otp :
 *      post : 
 *          tags : [User-Authentication]
 *          summary : check otp value in user controller
 *          description : check otp password with mobile-code and expires date
 *          parameters : 
 *          -   name : mobile
 *              description : fa-IRI phone number
 *              in : formData
 *              required : true
 *              type : string
 *          -   name : code
 *              description : enter sms code
 *              in : formData
 *              required : true
 *              type : string
 *          responses : 
 *               201 :
 *                  description : true
 *               400 : 
 *                  description : bad requst
 *               401 : 
 *                  description : unauthorization
 *               500 : 
 *                  description : internall server error
 */
router.post("/check-otp",UserAuthController.checkOtp)
/**
 * @swagger
 *  /user/refresh-token :
 *      post : 
 *          tags : [User-Authentication]
 *          summary : send refresh token for get new token and refresh token
 *          description : fresh token
 *          parameters : 
 *          -   name : refreshToken
 *              in : formData
 *              required : true
 *              type : string
 *          responses : 
 *               201 :
 *                  description : true
 *               400 : 
 *                  description : bad requst
 *               401 : 
 *                  description : unauthorization
 *               500 : 
 *                  description : internall server error
 */
router.post("/refresh-token",UserAuthController.refreshToken)
module.exports = {
    UserAuthRoutes : router 
}