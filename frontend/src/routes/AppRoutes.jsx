import { useEffect, useState } from 'react'
import { Routes , Route, useLocation, useNavigate } from 'react-router-dom'
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
import RoomCreate from '../pages/RoomCreate'
import RoomJoin from '../pages/RoomJoin'
import RoomDashboard from '../pages/RoomDashboard'
import RoomList from '../pages/RoomList'
import UpdateExpense from '../components/UpdateExpense'
import DeleteExpense from '../components/DeleteExpense'
import Contact from '../pages/Contact'
import Loader from '../components/Loader'
import GuidePage from '../pages/GuidePage'
const AppRoutes = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showSplash, setShowSplash] = useState(() => location.pathname === '/')

  useEffect(() => {
    if (!showSplash) {
      return
    }

    const timer = window.setTimeout(() => {
      setShowSplash(false)
    }, 2400)

    return () => window.clearTimeout(timer)
  }, [showSplash])

  const showHomeSplash = location.pathname === '/' && showSplash
  const showGuideButton = !showHomeSplash && location.pathname !== '/guide'

  return (
    <div>
        {!showHomeSplash && <Navbar />}
        {showGuideButton && (
          <button
            onClick={() => navigate('/guide')}
            className="fixed bottom-5 right-5 z-50 group rounded-full border border-white/10 bg-slate-950/95 px-4 py-3 text-white shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-indigo-400 hover:shadow-indigo-500/30 md:px-5 md:py-3.5"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A70A9] text-sm font-black shadow-lg shadow-[#4A70A9]/40 animate-pulse">
                ?
              </span>
              <span className="flex flex-col items-start leading-tight text-left">
                <span className="text-xs uppercase tracking-[0.24em] text-indigo-200/80">Need help?</span>
                <span className="text-sm font-semibold text-white">View Guide</span>
              </span>
            </span>
          </button>
        )}
        {showHomeSplash ? (
          <Loader />
        ) : (
        <Routes>
           <Route path='/' element={<Home />} />
             <Route path='/ExpenseList' element={<ExpenseList />} />
             <Route path='/Nav' element={<Navbar />} />
             <Route path='/AddExpense' element={<ExpenseForm />} />
             <Route path='/ExpenseCard' element={<ExpenseCard />} />
             <Route path='/dashboard' element={<Dashboard />} />
             <Route path='/admin' element={<AdminPortal />} />
             <Route path='/circle/create' element={<RoomCreate />} />
             <Route path='/circle/list' element={<RoomList />} />
             <Route path='/circle/join' element={<RoomJoin />} />
             <Route path='/circle/dashboard' element={<RoomDashboard />} />
             <Route path='/login' element={<Login />} />
             <Route path='/update/:expenseId' element={<UpdateExpense />} />
             <Route path='/delete/:expenseId' element={<DeleteExpense />} />
             <Route path='/features' element={<Features />} />
             <Route path='/register' element={<Register />} />
             <Route path='/contact' element={<Contact />} />
             <Route path='/guide' element={<GuidePage />} />
             <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
        )}
    </div>

  )
}

export default AppRoutes