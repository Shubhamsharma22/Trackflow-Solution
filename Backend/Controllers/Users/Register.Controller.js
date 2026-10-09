import User from "../../Models/User.Model.js"
import ApiError from "../../Utils/ApiError.Utils.js"
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js"
import bcrypt from "bcrypt"


const RegisterController=AsyncHandler(async(req,res)=>{
const {UserName,Email,password,role,Organization} = req.body

if(!UserName||!Email||!password) throw new ApiError(401,"User not valid")


    let hashpassword = await bcrypt.hash(password,10)


let newUser ={
    UserName,
    Email,
password:hashpassword,
role:role||"Member",
Organization
}

await User.create(newUser)

res.status(201).json({message:"User Registered Succesfully",newUser})



})


export default RegisterController