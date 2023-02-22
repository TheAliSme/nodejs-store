const redisClient = require("../utils/init-redis");
const { HomeRoute } = require("./api");
const { UserAuthRoutes } = require("./user/auth");
const router = require("express").Router();
(async() => {
    await redisClient.set("key","value");
    const value = await redisClient.get("key")
    console.log(value);
})()
router.use("/user",UserAuthRoutes)
router.use("/",HomeRoute)

module.exports = {
    AllRoutes : router  
}