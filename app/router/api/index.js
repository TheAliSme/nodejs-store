const homeController = require("../../http/controllers/api/home.controller");
const { VerifyAccessToken } = require("../../http/middlewares/verifyAccessToken");
const router = require("express").Router();

/**
 * @swagger
 * tags : 
 *  name : IndexPage
 *  description : index page route and data
 */
/**
 * @swagger
 * /:
 *  get :
 *      summary : index of routes
 *      tags : [IndexPage]
 *      description : get all need data for ndex page
 *      parameters : 
 *          -   in : header   
 *              name : access-token
 *              example : bearer yourToken...
 *      responses : 
 *          200 :
 *              description : success
 *          404 :
 *              description : not found
 */

router.get("/",VerifyAccessToken,homeController.indexPage)

module.exports = {
    HomeRoute : router
} 