import { createContext, useContext } from 'react'
import type { CalendarContextType } from './calendar-types'

export const CalendarContext = createContext<CalendarContextType>(
  // Provide default values that match the type
  {
    events: [],
    setEvents: () => {},
    mode: 'month',
    setMode: () => {},
    date: new Date(),
    setDate: () => {},
    calendarIconIsToday: true,
    newEventDialogOpen: false,
    setNewEventDialogOpen: () => {},
    manageEventDialogOpen: false,
    setManageEventDialogOpen: () => {},
    selectedEvent: null,
    setSelectedEvent: () => {}
  }
)

export function useCalendarContext() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider')
  }
  return context
}