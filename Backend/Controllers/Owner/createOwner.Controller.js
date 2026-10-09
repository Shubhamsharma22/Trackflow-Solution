import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import User from "../../Models/User.Model.js";
import bcrypt from "bcrypt"

const createOwner=AsyncHandler(async(req,res)=>{
const{UserName,password,Email} = req.body
if(!UserName|| !password|| !Email) throw new ApiError(400,"Required are missing")

let hashedpassword = await bcrypt.hash(password,10)

    let owner ={
    UserName,
    password:hashedpassword,
    role:"Owner",
    Email
}

    let newowner = await User.create(owner)

    if(!newowner) throw new ApiError(400,"No Owner was made")

res.status(201).json({
    message:"Owner Created Successfully",
    owner:{
        _id:newowner._id,
        UserName:newowner.UserName,
        Email:newowner.Email,
        role:newowner.role
    }
})

})

export default createOwner