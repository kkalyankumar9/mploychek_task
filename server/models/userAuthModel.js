const mongoose=require("mongoose");
const userAuthSchema=mongoose.Schema({
    userName:{type:String},
password:{type:String},
role:{type:String}
},
{versionKey: false})
const UserAuthModel=new mongoose.model("AuthData",userAuthSchema);
module.exports={UserAuthModel}