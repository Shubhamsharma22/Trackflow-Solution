import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import ApiError from "../Utils/ApiError.Utils.js"

dotenv.config()

const verificationToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "No token provided")
  }

  const token = authHeader.split(" ")[1]

  try {
    const verified = jwt.verify(token, process.env.JWT_Secret_Key)
    req.user = verified
    next()
  } catch (error) {
    res.status(401).json({ message: "Token not valid", error })
  }
}

export default verificationToken
