import User from "../../Models/User.Model.js"
import ApiError from "../../Utils/ApiError.Utils.js"
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

const LoginController=AsyncHandler(async(req,res)=>{
    const {Email,password} = req.body
    
    if(!Email||!password) throw new ApiError(401,"Enter Valid Credentials")
    
        let loguser= await User.findOne({Email})

        if(!loguser) throw new ApiError(401,"User Does not Exist")

            const isvalid = await bcrypt.compare(password,loguser.password)

            if(!isvalid) throw new ApiError(401,"Wrong Password")

                const token = jwt.sign({
                  id:loguser._id,
                    Email:loguser.Email,
                    UserName:loguser.UserName
                },process.env.JWT_Secret_Key)

                res.cookie("token",token,{
                    httpOnly:true,
                    sameSite:"none",
                    secure:true
                })

                res.status(201).json({message:"User Logged in",token})

})

export default LoginController