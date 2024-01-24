require("dotenv").config()
const express=require("express")
const cors=require("cors")


const secretKey="this is supposed to be a very secret key"

const CryptoJS = require('crypto-js');

// Function to encrypt text
const encryptText = (text, key) => {
  let encryptedText = CryptoJS.AES.encrypt(text, key).toString()
  return encryptedText;
};

// Function to decrypt text
const decryptText = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};


const app=express()
app.use(express.json())
app.use(cors())
app.post("/encrypt",async(req,res)=>{
    try{
        const {rawData,fileName,fileType}=req.body
        const encryptedText=encryptText(rawData,secretKey)
        res.status(200).json({encryptedText})
    }catch(error){
        console.log(error)
        res.status(405).json({error})
    }
})
app.post("/decrypt",async(req,res)=>{
    try{
        const {encryptedText}=req.body
        const decryptedText=decryptText(encryptedText,secretKey)
        res.status(200).json({decryptedText})
    }catch(error){
        console.log(error)
        res.status(405).json({error})
    }
})


app.listen(8080,()=>{
    console.log("Server Initiated")
})
