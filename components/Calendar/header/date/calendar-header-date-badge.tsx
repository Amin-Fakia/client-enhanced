import { useCalendarContext } from '../../calendar-context'
import { isSameMonth } from 'date-fns'

export default function CalendarHeaderDateBadge() {
  const { events, date } = useCalendarContext()
  if (!events || !date) {
    console.log('Events or date is undefined in CalendarHeaderDateBadge');
    return null;
  }
  const monthEvents = events.filter((event) => isSameMonth(event.start, date))

  if (!monthEvents.length) return null
  return (
    <div className="whitespace-nowrap rounded-sm border px-1.5 py-0.5 text-xs">
      {monthEvents.length} events
    </div>
  )
}
