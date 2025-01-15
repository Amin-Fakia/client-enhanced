'use client'

import {

  Button,
  Input,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card

} from "@nextui-org/react";

import { useEffect, useState } from 'react';

import '@schedule-x/theme-default/dist/index.css';
import "./custom-calendar-dark.css"; // Import the dark theme CSS

interface Event {
  event_id: number;
  event_name: string;
  from_date: string;
  until_date: string;
}

interface Person {
  person_id: number;
  name: string;
  email: string;
}

interface Object {
  object_id: number;
  object_name: string;
  ausgeliehen: boolean;
}

interface EventDetail {
  eventId: number;
  people: Person[];
  objects: Object[];
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventDetails, setEventDetails] = useState<{ [key: number]: EventDetail }>({});
  const [visibleDetails, setVisibleDetails] = useState<{ [key: number]: boolean }>({});
  const [people, setPeople] = useState<Person[]>([]);
  const [objects, setObjects] = useState<Object[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<number[]>([]);

  // Fetch events from the backend
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

    fetchEvents();
  }, []);

  // Fetch people and objects from the backend
  useEffect(() => {
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

    fetchPeopleAndObjects();
  }, []);

  const fetchEventDetails = async (eventId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/eventDetails/${eventId}`);
      const data = await response.json();
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        [eventId]: data,
      }));
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const toggleDetails = (eventId: number) => {
    if (!visibleDetails[eventId]) {
      fetchEventDetails(eventId);
    }
    setVisibleDetails((prevVisible) => ({
      ...prevVisible,
      [eventId]: !prevVisible[eventId],
    }));
  };

  const handleAddPeopleAndObjects = (eventId: number) => {
    setSelectedEventId(eventId);
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEventId === null) return;

    try {
      const existingPeople = eventDetails[selectedEventId]?.people.map(p => p.person_id) || [];
      const existingObjects = eventDetails[selectedEventId]?.objects.map(o => o.object_id) || [];

      // Add people to the event
      for (const personId of selectedPeople) {
        if (!existingPeople.includes(personId)) {
          await fetch('http://localhost:3001/eventPeople', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event_id: selectedEventId,
              person_id: personId,
            }),
          });
        }
      }

      // Add objects to the event
      for (const objectId of selectedObjects) {
        if (!existingObjects.includes(objectId)) {
          await fetch('http://localhost:3001/eventObjects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event_id: selectedEventId,
              object_id: objectId,
            }),
          });
        }
      }

      fetchEventDetails(selectedEventId);
      onOpenChange();
    } catch (error) {
      console.error('Error adding people and objects:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {events.map((event) => (
        <Card key={event.event_id} className="mb-4 p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{event.event_name}</h2>
          <p className="text-gray-700 dark:text-gray-300"><strong>Start:</strong> {new Date(event.from_date).toLocaleString()}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>End:</strong> {new Date(event.until_date).toLocaleString()}</p>
          <Button
            className="mt-4"
            onPress={() => toggleDetails(event.event_id)}
          >
            {visibleDetails[event.event_id] ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button
            className="mt-4 ml-2"
            onPress={() => handleAddPeopleAndObjects(event.event_id)}
          >
            Add People & Objects
          </Button>
          {visibleDetails[event.event_id] && eventDetails[event.event_id] && (
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">People</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {eventDetails[event.event_id].people.map((person) => (
                  <li key={person.person_id}>{person.name} ({person.email})</li>
                ))}
              </ul>
              <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">Objects</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {eventDetails[event.event_id].objects.map((object) => (
                  <li key={object.object_id}>{object.object_name} ({object.ausgeliehen ? 'Ausgeliehen' : 'Nicht Ausgeliehen'})</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ))}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h2>Add People & Objects</h2>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-bold mb-2">People</h3>
              <ul className="list-disc list-inside mb-4">
                {people.map((person) => (
                  <li key={person.person_id}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        value={person.person_id}
                        onChange={(e) => {
                          const personId = parseInt(e.target.value);
                          setSelectedPeople((prev) =>
                            e.target.checked
                              ? [...prev, personId]
                              : prev.filter((id) => id !== personId)
                          );
                        }}
                      />
                      <span className="ml-2">{person.name} ({person.email})</span>
                    </label>
                  </li>
                ))}
              </ul>
              <h3 className="text-lg font-bold mb-2">Objects</h3>
              <ul className="list-disc list-inside mb-4">
                {objects.map((object) => (
                  <li key={object.object_id}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        value={object.object_id}
                        onChange={(e) => {
                          const objectId = parseInt(e.target.value);
                          setSelectedObjects((prev) =>
                            e.target.checked
                              ? [...prev, objectId]
                              : prev.filter((id) => id !== objectId)
                          );
                        }}
                      />
                      <span className="ml-2">{object.object_name} ({object.ausgeliehen ? 'Ausgeliehen' : 'Nicht Ausgeliehen'})</span>
                    </label>
                  </li>
                ))}
              </ul>
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EventsPage;