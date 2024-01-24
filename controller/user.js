const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const path=require("path")
const { User } = require("../model/user")
const { randomBytes } = require("crypto")
exports.signup=async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const hashedPassword= bcrypt.hashSync(password,10)
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' , expiresIn:60*60*5});
        let key = await randomBytes(10).toString("hex")
        const user=new User(
            {
                username,
                email,
                hashedPassword,
                key
            }
        )
        await user.save()
        res.status(200).json(
            {
                username,
                token
            }
        )
    }catch(error){
        res.status(405).json(
            {
                error: "Failed to create account",
                errorMessage: error
            }
        )
    }
}
exports.verify=async(req,res)=>{
    try{
        const token=req.get("authorization").split("Bearer ")[1]
        const data=jwt.verify(token,process.env.JWT_SECRET_KEY)
        let userInfo
        if(data){
            userInfo=await User.findOne({email:data.email})
        }
        if(data && userInfo){
            res.status(206).send("good to go")
        }else{
            res.status(404).send("User not Authorised")
        }
    }catch(err){
        console.log(err)
        res.status(403).send("User not Authorised")
    }
}
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const data=await User.findOne(
            {
                email:email
            }
        ).exec()
        const isAuth=bcrypt.compareSync(password,data.hashedPassword)
        if(data && isAuth){
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' , expiresIn:60*60*5});
            res.status(201).json(
                {
                    username:data.username,
                    token
                }
            )
        }else if(!isAuth){
            res.status(403).send("Password Wrong")
        }else{
            res.status(402).send("Create Account first")
        }
    }catch(err){
        res.status(405).send("Login Failed")
    }
}