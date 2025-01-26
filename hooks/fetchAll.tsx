import { useEffect, useState } from 'react';

interface Event {
  event_id: number;
  event_name: string;
}

interface Person {
  person_id: number;
  person_name: string;
}

interface Object {
  object_id: number;
  object_name: string;
  imLager: boolean;
  categorie: string;
  beschreibung: string;
  assignedEvent?: string;
}

export const useFetchData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [objects, setObjects] = useState<Object[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/events');
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchPeopleAndObjects = async () => {
      try {
        const peopleResponse = await fetch('http://localhost:3001/people');
        const peopleData = await peopleResponse.json();
        setPeople(peopleData.people || []);

        const objectsResponse = await fetch('http://localhost:3001/objects');
        const objectsData = await objectsResponse.json();
        setObjects(objectsData.objects || []);
      } catch (error) {
        console.error('Error fetching people and objects:', error);
      }
    };

    fetchEvents();
    fetchPeopleAndObjects();
  }, []);

  return { events, people, objects };
};