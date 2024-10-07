require('dotenv').config();
const express = require('express')
const app = express()
const startTheDB = require('./Config/db');
const userRouter = require('./src/controllers/user.controller');
const blogRouter = require('./src/controllers/blog.controller');
const cors = require("cors")

app.use(express.json())
// Use CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));



//health-check route
app.get("/healthCheck", (req, res)=>{
    res.send("200 OK")
})

app.use('/user',userRouter)
app.use('/blog',blogRouter)

app.listen(process.env.PORT, async()=>{
    await startTheDB()
    console.log(`Hello from ${process.env.PORT}`)
})