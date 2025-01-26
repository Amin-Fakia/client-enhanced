import { useState, useEffect } from "react";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3001/events");
      const data = await response.json();
      const formattedEvents = data.events.map(event => ({
        id: event.event_id,
        title: event.event_name,
        start: new Date(event.from_date),
        end: new Date(event.until_date),
      }));
      setEvents(formattedEvents);
      return formattedEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async (event) => {
    
    try {
      const response = await fetch("http://localhost:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({event_name: event.title, from_date: event.start, until_date: event.end}),
      });
      const newEvent = await response.json();
      const formattedEvent = {
        id: newEvent.event_id, // Assuming `event_id` is returned from the API
        title: newEvent.event_name,
        start: new Date(newEvent.from_date),
        end: new Date(newEvent.until_date),
      };
      setEvents(prev => [...prev, formattedEvent]);
      return formattedEvent;
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:3001/events/${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events,fetchEvents, addEvent, deleteEvent };
};
