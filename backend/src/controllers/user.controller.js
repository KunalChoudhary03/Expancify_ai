const userModel = require("../model/user.model")   

async function loginUser(req, res) {
    //user Cookies or JWT token can be implemented here for authentication and session management
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email:email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(user.password !== password){
            return res.status(401).json({message:"Invalid password"})
        }
        res.status(200).json({message:"Login successful", user:user})
    }
    catch(err){
        res.status(500).json({message:"Server error", error:err.message})
    }   
}

async function registerUser(req, res) {
    const {username, email,password,fullName} = req.body;
    try{
        const user = await userModel.findOne({email:email})
        if(user){
            return res.status(409).json({message:"User already exists"})
        }
        const newUser = new userModel({
            username:username,
            email:email,
            password:password,
            fullName:fullName
        })
        await newUser.save()
        res.status(201).json({message:"User registered successfully", user:newUser})
    }
    catch(err){
        res.status(500).json({message:"Server error", error:err.message})
    }
}

async function logoutUser(req, res) {
    res.status(200).json({message:"Logout successful"}) 
}


module.exports = {loginUser, registerUser, logoutUser}