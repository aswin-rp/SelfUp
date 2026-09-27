import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/habits">Habits</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/savings">Savings</NavLink>
      </div>
      <button className="link-button" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
    </nav>
  )
}
