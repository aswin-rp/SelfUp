export type RepeatFrequency = 'none' | 'daily' | 'weekly' | 'custom'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null // ISO date string, e.g. "2026-09-30"
  is_completed: boolean
  category: string | null
  notifications_enabled: boolean
  notify_at: string | null // ISO datetime string
  repeat_frequency: RepeatFrequency
  created_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  notifications_enabled: boolean
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_date: string // ISO date string, e.g. "2026-09-26"
}

export interface JournalEntry {
  id: string
  user_id: string
  entry_date: string // ISO date string
  content: string
  created_at: string
  updated_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  saved_amount: number
  target_amount: number | null
  created_at: string
}
