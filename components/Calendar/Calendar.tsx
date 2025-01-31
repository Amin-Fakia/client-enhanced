import React, { useState, useRef,useEffect} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useEvents } from "@/hooks/useEvents";
import { useObjects } from "@/hooks/useObjects"; // Assuming you split object fetching logic here
import usePeople from "@/hooks/usePeople"; // Assuming you split people fetching logic here
import { EventModal } from "./EventModal";

const Calendar = () => {
  const { addEvent: addEventToBackend, deleteEvent: deleteEventFromBackend, fetchEvents } = useEvents();
  const [events, setEvents] = useState([]); // Local events state
  const { objects } = useObjects(); // Fetch objects
  const { people } = usePeople();   // Fetch people

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: new Date(), end: new Date() });
  const calendarRef = useRef(null);

  useEffect(() => {
    
    const loadEvents = async () => {
      const fetchedEvents = await fetchEvents();
      
      setEvents(fetchedEvents);
      
    };
    loadEvents()

    
  }, []);

  // Handle date selection from FullCalendar
  const handleDateSelect = (selectInfo) => {
    
    
    
    setSelectedDateRange({
      start: new Date(selectInfo.startStr),
      end: new Date(selectInfo.endStr),
    });
    setIsModalOpen(true);
  };

  // Handle event click to confirm deletion
  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`Do you want to delete the event '${clickInfo.event.title}'?`)) {
      const eventId = clickInfo.event.id; 
      // Delete from backend
       await deleteEventFromBackend(eventId);

       // Update local state
       setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
     
    }
  };
  // Handle event addition
  const handleAddEvent = async (newEvent) => {
    const eventToAdd = {
      title: newEvent.title,
      start: selectedDateRange.start.toISOString(),
      end: selectedDateRange.end.toISOString(),
    };

    // Add to backend
    const addedEvent = await addEventToBackend(eventToAdd);

    // Update local state with new event
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: addedEvent.id,
        title: addedEvent.title,
        start: new Date(addedEvent.start),
        end: new Date(addedEvent.end),
      },
    ]);
    

    setIsModalOpen(false);
  };
  

  return (
    
    <div className="bg-dark min-h-screen text-light p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Event Calendar</h1>

      {/* FullCalendar Component 
      TODO: AM PM time format to 24 Hour format
      */}
      <FullCalendar
        
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
      />

      {/* Modal for adding a new event */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dateRange={selectedDateRange}
          onAddEvent={handleAddEvent}
          objects={objects}
          people={people.people}
          calendarRef={calendarRef}
        />
      )}
    </div>
  );
};

export default Calendar;
