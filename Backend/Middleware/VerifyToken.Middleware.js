import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import ApiError from "../Utils/ApiError.Utils.js"

dotenv.config()

const verificationToken=(req,res,next)=>{
const authheader = req.cookies.token
if(!authheader) throw new ApiError(401,"Invalid Token")

try {
const verified = jwt.verify(authheader,process.env.JWT_Secret_Key)
    req.user=verified
    next()
} catch (error) {
    res.status(401).json({message:"token not valid",error})
}


}

export default verificationToken
