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
 *  /user/login : 
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

router.post("/login",UserAuthController.login)

module.exports = {
    UserAuthRoutes : router 
}