const express = require('express')
const authRoutes = require('./routes/auth.routes')
const expenseRoutes = require('./routes/expense.routes')
const aiRoutes = require('./routes/ai.routes')  
const adminRoutes = require('./routes/admin.routes')
const splitRoutes = require('./routes/split.routes')
const roomRoutes = require('./routes/room.routes')
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/split", splitRoutes)
app.use("/api/room", roomRoutes)
module.exports = app


// create leader borad for rooms in which user can see their register user can see others room pattern and can join the room and can see the pattern of other user's expense and can judge by them,  by there exepenses this  can if the user wants to join there room they can join in real room . 

// user profile mai users k bare mai or unka opinion ki vo kya jayada spend karte hai ya kam aur unka pattern kya hai aur uske hisab se unko suggestions dena ki unka pattern kaisa hai aur unko kya karna chahiye taki unka pattern acha ho sake.
// room ki location or request send karna or bhi jo yad ho teko vo bana dena 