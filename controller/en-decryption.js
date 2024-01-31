const CryptoJS = require('crypto-js');
const { User } = require('../model/user');
const encryptText = (text, key) => {
  let encryptedText = CryptoJS.AES.encrypt(text, key).toString()
  return encryptedText;
};
const encryptKey=(key)=>{
    let encryptedKey = CryptoJS.AES.encrypt(key, process.env.KEY_ENCRYPTER).toString()
    return encryptedKey;
}
const decryptKey=(encryptedKey)=>{
    const bytes = CryptoJS.AES.decrypt(encryptedKey, process.env.KEY_ENCRYPTER);
    const decryptedKey = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedKey;
}
const decryptText = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
exports.encrypt=async(req,res)=>{
    try{
        const {rawData,fileName,fileType}=req.body
        const user=await User.findOne({email: req.email})
        const encryptedKey=encryptKey(user.key)
        const encryptedText=encryptText(rawData,user.key)
        const encryptedData=JSON.stringify({k:encryptedKey,t:encryptedText})
        res.status(200).json({encryptedData})
    }catch(error){
        console.log(error)
        res.status(405).json({error})
    }
}
exports.decrypt=async(req,res)=>{
    try{
        const {encryptedData}=req.body
        const d=JSON.parse(encryptedData)
        const user=await User.findOne({email: req.email})
        if(decryptKey(d.k)==user.key){
            console.log("hi")
            const decryptedText=decryptText(d.t,user.key)
            res.status(200).json({decryptedText})
        }else{
            res.status(403).send("Your account is not authorised to decrypt this image")
        }
    }catch(error){
        console.log(error)
        res.status(405).json({error})
    }
}