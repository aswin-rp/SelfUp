import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Nav from './components/Nav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Habits from './pages/Habits'
import Journal from './pages/Journal'
import Savings from './pages/Savings'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="page"><p className="muted">Loading...</p></div>
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="app-shell">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
