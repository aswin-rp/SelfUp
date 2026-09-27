import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { Task } from '../types'
import TaskItem from '../components/TaskItem'
import TaskForm, { TaskFormValues } from '../components/TaskForm'

export default function Tasks() {
  const { session } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true, nullsFirst: false })

    if (!error && data) setTasks(data as Task[])
    setLoading(false)
  }

  async function handleSave(values: TaskFormValues) {
    if (!session) return

    const payload = {
      title: values.title,
      description: values.description || null,
      due_date: values.due_date || null,
      category: values.category || null,
      notifications_enabled: values.notifications_enabled,
      notify_at: values.notifications_enabled && values.notify_at
        ? new Date(values.notify_at).toISOString()
        : null,
      repeat_frequency: values.notifications_enabled ? values.repeat_frequency : 'none'
    }

    if (editing) {
      await supabase.from('tasks').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('tasks').insert({ ...payload, user_id: session.user.id })
    }

    setShowForm(false)
    setEditing(null)
    loadTasks()
  }

  async function toggleComplete(task: Task) {
    await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id)
    loadTasks()
  }

  async function deleteTask(task: Task) {
    await supabase.from('tasks').delete().eq('id', task.id)
    loadTasks()
  }

  const pending = tasks.filter((t) => !t.is_completed)
  const completed = tasks.filter((t) => t.is_completed)

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tasks</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }}>+ New task</button>
      </div>

      {showForm && (
        <div className="form-panel">
          <TaskForm
            initial={editing}
            onCancel={() => { setShowForm(false); setEditing(null) }}
            onSave={handleSave}
          />
        </div>
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <>
          <section>
            <h2 className="section-label">Pending ({pending.length})</h2>
            {pending.length === 0 && <p className="muted">Nothing pending. Nice.</p>}
            {pending.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onEdit={(t) => { setEditing(t); setShowForm(true) }}
              />
            ))}
          </section>

          {completed.length > 0 && (
            <section>
              <h2 className="section-label">Completed ({completed.length})</h2>
              {completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                  onEdit={(t) => { setEditing(t); setShowForm(true) }}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
