const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    title:{type:String, required:true},
    amount:{type:Number, required:true},
    date:{type:Date, required:true},
    paidBy:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},

})

const expenseModel = mongoose.model("expense", expenseSchema)

module.exports = expenseModel;