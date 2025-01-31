'use client'

import { useState, useEffect } from 'react';
import { CalendarEvent, Mode } from '@/components/Calendar/calendar-types';
import CalendarProvider from '@/components/Calendar/calendar-provider';
import { useEvents } from '@/hooks/useEvents';
import Calendar from '@/components/Calendar/calendar';

const EventsPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mode, setMode] = useState<Mode>('month');
  const [date, setDate] = useState<Date>(new Date());
  const [calendarIconIsToday, setCalendarIconIsToday] = useState<boolean>(true);
  const { fetchEvents } = useEvents();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEvents();
      if (data) {
        setEvents(data);
      }
    };
    fetchData();
  }, []);

  // Ensure date is a valid Date object before passing to CalendarProvider
  const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  return (
      <div className="border-2 border-blue-500 rounded-lg ">
        <Calendar 
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={validDate}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
      />
      </div>
      

  );
};

export default EventsPage;