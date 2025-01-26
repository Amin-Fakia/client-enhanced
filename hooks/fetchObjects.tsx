import { useEffect, useState } from 'react';

interface Object {
  object_id: number;
  object_name: string;
  imLager: boolean;
  categorie: string;
  beschreibung: string;
  assignedEvent?: string;
}

interface Event {
  event_id: number;
  event_name: string;
}

export const useFetchData = () => {
  const [objects, setObjects] = useState<Object[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/objects');
        const data = await response.json();
        setObjects(data.objects || []);
      } catch (error) {
        console.error('Error fetching objects:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/events');
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchObjects();
    fetchEvents();
  }, []);

  return { objects, events, setObjects };
};