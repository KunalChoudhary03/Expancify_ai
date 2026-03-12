import { Routes , Route } from 'react-router-dom'
import ExpenseList from '../components/ExpenseList'
import ExpenseCard from '../components/ExpenseCard'
import ExpenseForm from '../components/ExpenseForm'
import Navbar from '../components/Navbar'
import Home from '../components/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import AdminPortal from '../pages/AdminPortal'
import Features from '../pages/Features'
import UpdateExpense from '../components/UpdateExpense'
import DeleteExpense from '../components/DeleteExpense'
import Contact from '../pages/Contact'
const AppRoutes = () => {
  return (
    <div>
        <Navbar />
        <Routes>
           <Route path='/' element={<Home />} />
             <Route path='/ExpenseList' element={<ExpenseList />} />
             <Route path='/Nav' element={<Navbar />} />
             <Route path='/AddExpense' element={<ExpenseForm />} />
             <Route path='/ExpenseCard' element={<ExpenseCard />} />
             <Route path='/dashboard' element={<Dashboard />} />
             <Route path='/admin' element={<AdminPortal />} />
             <Route path='/login' element={<Login />} />
             <Route path='/update/:expenseId' element={<UpdateExpense />} />
             <Route path='/delete/:expenseId' element={<DeleteExpense />} />
             <Route path='/features' element={<Features />} />
             <Route path='/register' element={<Register />} />
             <Route path='/contact' element={<Contact />} />
             <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
    </div>

  )
}

export default AppRoutes