import { FormEvent, useEffect, useState } from 'react'
import { RepeatFrequency, Task } from '../types'

export interface TaskFormValues {
  title: string
  description: string
  due_date: string
  category: string
  notifications_enabled: boolean
  notify_at: string
  repeat_frequency: RepeatFrequency
}

interface Props {
  initial?: Task | null
  onCancel: () => void
  onSave: (values: TaskFormValues) => void
}

const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  due_date: '',
  category: '',
  notifications_enabled: false,
  notify_at: '',
  repeat_frequency: 'none'
}

export default function TaskForm({ initial, onCancel, onSave }: Props) {
  const [values, setValues] = useState<TaskFormValues>(emptyValues)

  useEffect(() => {
    if (initial) {
      setValues({
        title: initial.title,
        description: initial.description ?? '',
        due_date: initial.due_date ?? '',
        category: initial.category ?? '',
        notifications_enabled: initial.notifications_enabled,
        notify_at: initial.notify_at ? initial.notify_at.slice(0, 16) : '',
        repeat_frequency: initial.repeat_frequency
      })
    } else {
      setValues(emptyValues)
    }
  }, [initial])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!values.title.trim()) return
    onSave(values)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          required
        />
      </label>

      <label>
        Notes (optional)
        <textarea
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          rows={2}
        />
      </label>

      <div className="form-row">
        <label>
          Due date (optional)
          <input
            type="date"
            value={values.due_date}
            onChange={(e) => setValues({ ...values, due_date: e.target.value })}
          />
        </label>
        <label>
          Category (optional)
          <input
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
          />
        </label>
      </div>

      <div className="notif-toggle">
        <label className="switch-label">
          Notifications for this task
          <input
            type="checkbox"
            checked={values.notifications_enabled}
            onChange={(e) =>
              setValues({ ...values, notifications_enabled: e.target.checked })
            }
          />
        </label>

        {values.notifications_enabled && (
          <div className="notif-options">
            <label>
              Notify at
              <input
                type="datetime-local"
                value={values.notify_at}
                onChange={(e) => setValues({ ...values, notify_at: e.target.value })}
              />
            </label>
            <label>
              Repeat
              <select
                value={values.repeat_frequency}
                onChange={(e) =>
                  setValues({
                    ...values,
                    repeat_frequency: e.target.value as RepeatFrequency
                  })
                }
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">{initial ? 'Save changes' : 'Add task'}</button>
      </div>
    </form>
  )
}
