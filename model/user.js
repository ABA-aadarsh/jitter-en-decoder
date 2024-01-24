const mongoose=require("mongoose")
const {Schema}=mongoose
const schema=new Schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type: String,
            required: true,
            unique:true,
            validate: {
                validator: function (value) {
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email address format'
            }
        },
        hashedPassword:{
            type:String,
            required: true
        },
        key:{
            type:String,
            required:true
        }
    }
)

exports.User=mongoose.model("User",schema)