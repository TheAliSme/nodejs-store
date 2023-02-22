const redisDB = require("redis")
const redisClient = redisDB.createClient();
redisClient.connect();
redisClient.on("connect",() => console.log("connect to redis"))
redisClient.on("ready",() => console.log("redis is ready to use..."))
redisClient.on("error",(err) => console.log("Redis error is :",err.message))
redisClient.on("end",() => console.log("redis disconnected"))

module.exports = redisClient