import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
import { YSocketIO } from "y-socket.io/dist/server"

const app=express();
app.use(express.static("public"))
const httpServer=createServer(app);

const io=new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

const ysocketio=new YSocketIO(io);
ysocketio.initialize()

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello",
        success:true
    })
})
app.get("/api",(req,res)=>{
    res.status(200).json({
        message:"api",
        success:true
    })
})

httpServer.listen(3000,()=>{
    console.log("Server running on port 3000")
})