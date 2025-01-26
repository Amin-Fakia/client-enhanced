'use client'

import { useFetchData } from '@/hooks/fetchAll';
import { useState } from 'react';
import { Card, CardHeader, Button,CardBody, CardFooter, Modal, ModalContent, ModalHeader} from "@nextui-org/react";
import CalendarComponent from '@/components/Calendar/Calendar';

const EventsPage = () => {
  const { events, people, objects } = useFetchData();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      <CalendarComponent/>
      {/* <div className="flex flex-wrap gap-4 justify-start">
        {events.map(event => (
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4" key={event.event_id}>
            <Card>
              <CardHeader>
                <h4>{event.event_name}</h4>
              </CardHeader>
              <CardBody>
                <h4>Event ID: {event.event_id}</h4>
              </CardBody>
              <CardFooter>
                <Button onPress={() => handleShowDetails(event)}>More details...</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div> */}

      
    </div>
  );
};

export default EventsPage;