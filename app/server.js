const express = require("express")
const {mongoose} = require("mongoose")
const morgan = require("morgan")
const path = require("path")
const { AllRoutes } = require("./router/router")
const createErrors = require("http-errors")
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

module.exports = class Application {
    #app = express()
    #DB_URI;
    #PORT; 
    constructor(PORT,DB_URI){
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }
    configApplication(){
        this.#app.use(morgan("dev"))
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended : true}));
        this.#app.use(express.static(path.join(__dirname,"..","public")));
        this.#app.use("/api-doc",swaggerUi.serve,swaggerUi.setup(swaggerJsDoc({
            swaggerDefinition : {
                info : {
                    title : "SME store",
                    version : "1.0.0",
                    description : "the largest online store selling home and building protection supplies",
                    contact : {
                        name : "ali samaei",
                        email : "ali2000@gmail.com"
                    }
                },
                servers : [
                    {
                        url : "http://localhost:5001"
                    }
                ]
            },
            apis : ["./app/router/*/*.js"]
        })))
    }
    createServer(){
        const http = require("http")
        http.createServer(this.#app).listen(this.#PORT,() => {
            console.log("run > http://localhost:" + this.#PORT);
        })
    }
    connectToMongoDB(){
        mongoose.connect(this.#DB_URI,(error) => {
            if(!error) return console.log("Connected to mongoDB");
            return console.log(error.message);
        })
        mongoose.connection.on("connected",() => {
            console.log("mongoos connected to DB")
        })
        mongoose.connection.on("disconnected",() => {
            console.log("mongoose connection is disconnected")
        })
        process.on("SIGINT",async () => {
            await mongoose.connection.close();
            process.exit(0)
        })
    }
    createRoutes(){
        this.#app.use(AllRoutes)
    }
    errorHandling(){
        this.#app.use((req,res,next) => {
            next(createErrors.NotFound("page not found!."))
        })
        this.#app.use((error,req,res,next) => {
            const serverError = createErrors.InternalServerError()
            const statusCode = error.status || serverError.status
            const message = error.message || serverError.message
            return res.status(statusCode).json({
                errors :{
                    statusCode,
                    message
                }
            })
        })
    }
}