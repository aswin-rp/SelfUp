import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { SavingsGoal } from '../types'

export default function Savings() {
  const { session } = useAuth()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({})

  useEffect(() => {
    loadGoals()
  }, [])

  async function loadGoals() {
    setLoading(true)
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: true })
    setGoals((data as SavingsGoal[]) ?? [])
    setLoading(false)
  }

  async function addGoal(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !session) return
    await supabase.from('savings_goals').insert({
      name: name.trim(),
      target_amount: target ? Number(target) : null,
      saved_amount: 0,
      user_id: session.user.id
    })
    setName('')
    setTarget('')
    loadGoals()
  }

  async function addMoney(goal: SavingsGoal) {
    const amountStr = addAmounts[goal.id]
    const amount = Number(amountStr)
    if (!amount) return
    await supabase
      .from('savings_goals')
      .update({ saved_amount: goal.saved_amount + amount })
      .eq('id', goal.id)
    setAddAmounts({ ...addAmounts, [goal.id]: '' })
    loadGoals()
  }

  async function deleteGoal(id: string) {
    await supabase.from('savings_goals').delete().eq('id', id)
    loadGoals()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Savings</h1>
      </div>

      <form className="inline-form" onSubmit={addGoal}>
        <input
          placeholder="Goal name (e.g. New phone)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target (optional)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <button type="submit">Add goal</button>
      </form>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : goals.length === 0 ? (
        <p className="muted">No savings goals yet.</p>
      ) : (
        <div className="savings-list">
          {goals.map((goal) => {
            const pct = goal.target_amount
              ? Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100))
              : null
            return (
              <div key={goal.id} className="savings-card">
                <div className="savings-card-header">
                  <span className="savings-name">{goal.name}</span>
                  <button className="icon-button" onClick={() => deleteGoal(goal.id)}>✕</button>
                </div>
                <div className="savings-amount">
                  ₹{goal.saved_amount.toLocaleString()}
                  {goal.target_amount && <span className="muted"> / ₹{goal.target_amount.toLocaleString()}</span>}
                </div>
                {pct !== null && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
                <div className="savings-add-row">
                  <input
                    type="number"
                    placeholder="Add amount"
                    value={addAmounts[goal.id] ?? ''}
                    onChange={(e) => setAddAmounts({ ...addAmounts, [goal.id]: e.target.value })}
                  />
                  <button className="secondary" onClick={() => addMoney(goal)}>Add</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
