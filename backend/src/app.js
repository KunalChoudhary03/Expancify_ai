const express = require('express')
const authRoutes = require('./routes/auth.routes')
const expenseRoutes = require('./routes/expense.routes')
const app = express()
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)
module.exports = app