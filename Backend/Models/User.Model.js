import mongoose, { model, Mongoose, Schema } from "mongoose";

const Userschema = new Schema({
    UserName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
role:{
    type:String,
    enum:["Admin","Owner","Member"],
    default:"Member",
    required:true
},
Organization:{
    type:Schema.Types.ObjectId,
    ref:"Organization"
},


}, { timestamps: true })

const User = mongoose.model("User",Userschema)

export default User