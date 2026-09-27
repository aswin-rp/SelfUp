import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Habit, HabitLog, SavingsGoal, Task } from '../types'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    async function load() {
      const [taskRes, habitRes, logRes, goalRes] = await Promise.all([
        supabase.from('tasks').select('*').order('due_date', { ascending: true }),
        supabase.from('habits').select('*'),
        supabase.from('habit_logs').select('*').eq('completed_date', todayStr),
        supabase.from('savings_goals').select('*')
      ])
      setTasks((taskRes.data as Task[]) ?? [])
      setHabits((habitRes.data as Habit[]) ?? [])
      setLogs((logRes.data as HabitLog[]) ?? [])
      setGoals((goalRes.data as SavingsGoal[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="page"><p className="muted">Loading...</p></div>

  const dueTodayOrOverdue = tasks.filter(
    (t) => !t.is_completed && t.due_date && t.due_date <= todayStr
  )
  const completedTodayCount = tasks.filter((t) => t.is_completed).length
  const habitsDoneToday = new Set(logs.map((l) => l.habit_id))
  const totalSaved = goals.reduce((sum, g) => sum + g.saved_amount, 0)

  return (
    <div className="page">
      <div className="page-header">
        <h1>Today · {format(new Date(), 'EEEE, MMMM d')}</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="section-label">Tasks due</h2>
          {dueTodayOrOverdue.length === 0 ? (
            <p className="muted">Nothing due. You're clear.</p>
          ) : (
            <ul className="plain-list">
              {dueTodayOrOverdue.map((t) => (
                <li key={t.id}>{t.title} <span className="muted">({t.due_date})</span></li>
              ))}
            </ul>
          )}
          <p className="muted small">{completedTodayCount} task(s) completed overall</p>
          <Link className="link-button" to="/tasks">Go to tasks →</Link>
        </div>

        <div className="card">
          <h2 className="section-label">Habits today</h2>
          {habits.length === 0 ? (
            <p className="muted">No habits yet.</p>
          ) : (
            <ul className="plain-list">
              {habits.map((h) => (
                <li key={h.id}>
                  {habitsDoneToday.has(h.id) ? '✅' : '⬜'} {h.name}
                </li>
              ))}
            </ul>
          )}
          <Link className="link-button" to="/habits">Go to habits →</Link>
        </div>

        <div className="card">
          <h2 className="section-label">Journal</h2>
          <p className="muted">Capture a quick note about today.</p>
          <Link className="link-button" to="/journal">Open journal →</Link>
        </div>

        <div className="card">
          <h2 className="section-label">Savings</h2>
          <p className="savings-total">₹{totalSaved.toLocaleString()} saved across {goals.length} goal(s)</p>
          <Link className="link-button" to="/savings">View savings →</Link>
        </div>
      </div>
    </div>
  )
}
