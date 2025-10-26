import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Challenges from './pages/Challenges'
import ChallengeDetail from './pages/ChallengeDetail'
import Analytics from './pages/Analytics'
import Groups from './pages/Groups'
import Profile from './pages/Profile'
import VerifyAction from './pages/VerifyAction'
import ProtectedRoute from './components/ProtectedRoute'
import { logout } from './lib/auth'
import { Leaf, BarChart3, Users, ShieldCheck, LogOut } from 'lucide-react'

function Nav() {
  const nav = useNavigate()
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <Link to="/" className="flex items-center gap-2 font-semibold"><Leaf /> GreenSteps PRO</Link>
      <nav className="flex items-center gap-3">
        <Link to="/challenges" className="hover:underline">Challenges</Link>
        <Link to="/analytics" className="hover:underline flex items-center gap-1"><BarChart3 size={18}/>Analytics</Link>
        <Link to="/groups" className="hover:underline flex items-center gap-1"><Users size={18}/>Groups</Link>
        <Link to="/profile" className="hover:underline flex items-center gap-1"><ShieldCheck size={18}/>Profile</Link>
        <button onClick={() => { logout(); nav('/login'); }} className="text-red-600 flex items-center gap-1">
          <LogOut size={18}/>Logout
        </button>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/" element={
        <ProtectedRoute>
          <>
            <Nav/>
            <Dashboard/>
          </>
        </ProtectedRoute>
      }/>
      <Route path="/challenges" element={
        <ProtectedRoute><><Nav/><Challenges/></></ProtectedRoute>
      }/>
      <Route path="/challenges/:id" element={
        <ProtectedRoute><><Nav/><ChallengeDetail/></></ProtectedRoute>
      }/>
      <Route path="/analytics" element={
        <ProtectedRoute><><Nav/><Analytics/></></ProtectedRoute>
      }/>
      <Route path="/groups" element={
        <ProtectedRoute><><Nav/><Groups/></></ProtectedRoute>
      }/>
      <Route path="/verify" element={
        <ProtectedRoute><><Nav/><VerifyAction/></></ProtectedRoute>
      }/>
      <Route path="/profile" element={
        <ProtectedRoute><><Nav/><Profile/></></ProtectedRoute>
      }/>
    </Routes>
  )
}
