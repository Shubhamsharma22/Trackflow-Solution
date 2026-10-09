
const validateRegister=(req,res,next)=>{
    const{UserName,Email,password} = req.body
    const errors=[]

    if(!UserName){
        errors.push("Provide Valid Username")
    }

    if(!Email|| !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(Email)){
        errors.push("Enter Valid Email ID")
    }

    if(!password||password.length<6){
        errors.push("Enter a Valid Password")
    }


    if(errors.length>0){
      return  res.status(401).json({errors})
    }

    next()
}

export default validateRegister