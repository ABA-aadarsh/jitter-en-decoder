const express=require("express")
const route=express.Router()
const {decrypt,encrypt}=require("../controller/en-decryption")
route
.post("/encrypt",encrypt)
.post("/decrypt",decrypt)

exports.route=route