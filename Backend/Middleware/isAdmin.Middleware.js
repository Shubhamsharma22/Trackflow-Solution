import User from "../Models/User.Model.js"

const isAdmin=async(req,res,next)=>{
    try{
    const current = await User.findById(req.user.id)
    if (!current) {
      return res.status(404).json({ message: "User not found" });
    }

    if (current.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }
    next()
    }
    catch(error){
 res.status(401).json({message:"Error",error})
    }
}

export default isAdmin