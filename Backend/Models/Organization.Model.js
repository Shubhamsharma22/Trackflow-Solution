import mongoose, { model, Mongoose, Schema } from "mongoose";

const OrganizationSchema = new Schema({
    Name:{
        type:String,
        required:true
    },
    Owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    Members:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
},{timestamps:true})

const Organization = mongoose.model("Organization",OrganizationSchema)

export default Organization