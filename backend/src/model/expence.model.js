const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    title:{type:String, required:true},
    amount:{type:Number, required:true},
    date:{type:String, required:true},
    paidBy:{type:String, required:true},
})

const expenseModel = mongoose.model("expense", expenseSchema)

module.exports = expenseModel;