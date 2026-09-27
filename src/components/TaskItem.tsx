import { Task } from '../types'

interface Props {
  task: Task
  onToggleComplete: (task: Task) => void
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
}

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit }: Props) {
  return (
    <div className={`task-item ${task.is_completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={() => onToggleComplete(task)}
      />
      <div className="task-info" onClick={() => onEdit(task)}>
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          {task.due_date && <span>Due {task.due_date}</span>}
          {task.category && <span className="tag">{task.category}</span>}
          {task.notifications_enabled && <span className="tag notif">🔔</span>}
        </div>
      </div>
      <button className="icon-button" onClick={() => onDelete(task)} aria-label="Delete task">
        ✕
      </button>
    </div>
  )
}
