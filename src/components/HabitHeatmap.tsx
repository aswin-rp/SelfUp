import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'

interface Props {
  monthDate: Date
  completedDates: Set<string> // dates in "yyyy-MM-dd" format
  onDayClick: (dateStr: string) => void
}

export default function HabitHeatmap({ monthDate, completedDates, onDayClick }: Props) {
  const days = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate)
  })

  // Pad the start so the grid lines up under weekday columns (Sun-Sat)
  const firstDayOfWeek = startOfMonth(monthDate).getDay()
  const paddingCells = Array.from({ length: firstDayOfWeek })

  return (
    <div className="heatmap">
      <div className="heatmap-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="heatmap-grid">
        {paddingCells.map((_, i) => (
          <div key={`pad-${i}`} className="heatmap-cell empty" />
        ))}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const active = completedDates.has(dateStr)
          return (
            <button
              key={dateStr}
              className={`heatmap-cell ${active ? 'active' : ''}`}
              title={dateStr}
              onClick={() => onDayClick(dateStr)}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
