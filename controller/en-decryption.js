const CryptoJS = require('crypto-js');
const { User } = require('../model/user');
const encryptText = (text, key) => {
  let encryptedText = CryptoJS.AES.encrypt(text, key).toString()
  return encryptedText;
};
const decryptText = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
exports.encrypt=async(req,res)=>{
    try{
        const {rawData,fileName,fileType}=req.body
        const user=await User.findOne({email: req.email})
        const encryptedText=encryptText(rawData,user.key)
        res.status(200).json({encryptedText})
    }catch(error){
        console.log(error)
        res.status(405).json({error})
    }
}
exports.decrypt=async(req,res)=>{
    try{
        const {encryptedText}=req.body
        const user=await User.findOne({email: req.email})
        const decryptedText=decryptText(encryptedText,user.key)
        res.status(200).json({decryptedText})
    }catch(error){
        console.log(error)
        res.status(405).json({error})
    }
}