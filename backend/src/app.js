const express = require('express')
const authRoutes = require('./routes/auth.routes')
const expenseRoutes = require('./routes/expense.routes')
const aiRoutes = require('./routes/ai.routes')  
const adminRoutes = require('./routes/admin.routes')
const splitRoutes = require('./routes/split.routes')
const roomRoutes = require('./routes/room.routes')
const cors = require('cors')
const app = express()

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({
  // Allow configured client; if wildcard, disable credentials so browsers allow it
  origin: allowedOrigin === '*' ? true : allowedOrigin,
  credentials: allowedOrigin === '*' ? false : true
}))
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/split", splitRoutes)
app.use("/api/circle", roomRoutes)
module.exports = app
