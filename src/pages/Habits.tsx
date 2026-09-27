import { FormEvent, useEffect, useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { Habit, HabitLog } from '../types'
import HabitHeatmap from '../components/HabitHeatmap'

export default function Habits() {
  const { session } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
  const [monthDate, setMonthDate] = useState(new Date())
  const [newHabitName, setNewHabitName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHabits()
  }, [])

  async function loadHabits() {
    setLoading(true)
    const { data: habitData } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })

    const { data: logData } = await supabase.from('habit_logs').select('*')

    setHabits((habitData as Habit[]) ?? [])
    setLogs((logData as HabitLog[]) ?? [])
    if (habitData && habitData.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habitData[0].id)
    }
    setLoading(false)
  }

  async function addHabit(e: FormEvent) {
    e.preventDefault()
    if (!newHabitName.trim() || !session) return
    await supabase.from('habits').insert({
      name: newHabitName.trim(),
      user_id: session.user.id
    })
    setNewHabitName('')
    loadHabits()
  }

  async function deleteHabit(habit: Habit) {
    await supabase.from('habits').delete().eq('id', habit.id)
    if (selectedHabitId === habit.id) setSelectedHabitId(null)
    loadHabits()
  }

  async function toggleDay(dateStr: string) {
    if (!selectedHabitId || !session) return
    const existing = logs.find(
      (l) => l.habit_id === selectedHabitId && l.completed_date === dateStr
    )
    if (existing) {
      await supabase.from('habit_logs').delete().eq('id', existing.id)
    } else {
      await supabase.from('habit_logs').insert({
        habit_id: selectedHabitId,
        user_id: session.user.id,
        completed_date: dateStr
      })
    }
    loadHabits()
  }

  const completedDatesForSelected = useMemo(() => {
    return new Set(
      logs.filter((l) => l.habit_id === selectedHabitId).map((l) => l.completed_date)
    )
  }, [logs, selectedHabitId])

  const streak = useMemo(() => {
    let count = 0
    let cursor = new Date()
    while (completedDatesForSelected.has(format(cursor, 'yyyy-MM-dd'))) {
      count += 1
      cursor = subDays(cursor, 1)
    }
    return count
  }, [completedDatesForSelected])

  const selectedHabit = habits.find((h) => h.id === selectedHabitId)

  return (
    <div className="page">
      <div className="page-header">
        <h1>Habits</h1>
      </div>

      <form className="inline-form" onSubmit={addHabit}>
        <input
          placeholder="New habit name (e.g. Programming)"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <button type="submit">Add habit</button>
      </form>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : habits.length === 0 ? (
        <p className="muted">No habits yet. Add one above.</p>
      ) : (
        <div className="habits-layout">
          <div className="habit-list">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={`habit-list-item ${habit.id === selectedHabitId ? 'selected' : ''}`}
                onClick={() => setSelectedHabitId(habit.id)}
              >
                <span>{habit.name}</span>
                <button
                  className="icon-button"
                  onClick={(e) => { e.stopPropagation(); deleteHabit(habit) }}
                  aria-label="Delete habit"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {selectedHabit && (
            <div className="habit-detail">
              <div className="habit-detail-header">
                <h2>{selectedHabit.name}</h2>
                <span className="streak-badge">🔥 {streak} day streak</span>
              </div>

              <div className="month-nav">
                <button
                  className="secondary"
                  onClick={() =>
                    setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))
                  }
                >
                  ← Prev
                </button>
                <span>{format(monthDate, 'MMMM yyyy')}</span>
                <button
                  className="secondary"
                  onClick={() =>
                    setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))
                  }
                >
                  Next →
                </button>
              </div>

              <HabitHeatmap
                monthDate={monthDate}
                completedDates={completedDatesForSelected}
                onDayClick={toggleDay}
              />

              <p className="muted small">
                Click any day to mark it done or undo it. This month:{' '}
                {[...completedDatesForSelected].filter((d) =>
                  d.startsWith(format(monthDate, 'yyyy-MM'))
                ).length}{' '}
                days active.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
