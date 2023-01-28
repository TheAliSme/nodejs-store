const { HomeRoute } = require("./api");
const { UserAuthRoutes } = require("./user/auth");
const router = require("express").Router();

router.use("/user",UserAuthRoutes)
router.use("/",HomeRoute)

module.exports = {
    AllRoutes : router  
}