require("dotenv").config()
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const UserRouter =require("./routes/user")
const APIRouter=require("./routes/en-decryption")
const app=express()
app.use(express.json())
app.use(cors())
const connectDatabase=async()=>{
    const res= await mongoose.connect(process.env.DB_URL)
    if(res){
     console.log("Connection to database successful")
    }
 }
const authenticate=(req,res,next)=>{
    try{
        const token=req.get("authorization").split("Bearer ")[1]
        const data=jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(data){
            req.email=data.email
            next()
        }else{
            res.status(403).send("User not Authorised")
        }
    }catch(err){
        res.status(403).send("User not Authorised")
    }
}
connectDatabase()
app.use("/auth",UserRouter.route)
app.use("/api",authenticate,APIRouter.route)
app.use("/",express.static("dist"))

app.listen(8080,()=>{
    console.log("Server Initiated")
})
