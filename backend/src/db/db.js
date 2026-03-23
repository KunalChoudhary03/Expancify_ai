const mongoose = require('mongoose')


const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    }
    catch(err){
        console.log("Error connecting to MongoDB:", err);
    }
}

module.exports = connectDB  