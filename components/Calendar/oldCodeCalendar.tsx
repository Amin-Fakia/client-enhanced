import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Button, DateInput, Textarea, DatePicker, Listbox,ListboxItem, select} from "@nextui-org/react";

import { parseAbsoluteToLocal, now,DateValue} from "@internationalized/date";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}
// export async function getServerSideProps() { 
//   const response = await fetch('http://localhost:3001/events');
//   const data = await response.json();
  
//   return {
//     props: { 
//       events: data.events 
//     },
//   };
// }
export const ListboxWrapper = ({children}) => (
  <div className="w-full mb-5 max-w border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [objects, setObjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedObjectIds, setSelectedObjectIds] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    start: new Date(), // Start with current date as Date object
    end: new Date(),   // Start with current date as Date object
  });

  const handleDateSelect = (selectInfo) => {
    const startDate = new Date(selectInfo.startStr);  // Convert to Date object
    const endDate = new Date(selectInfo.endStr);      // Convert to Date object

    setNewEvent({
      ...newEvent,
      start: startDate,  // Store as Date object
      end: endDate,      // Store as Date object
    });

    setIsModalOpen(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    console.log(selectedObjectIds)
    
    if (newEvent.title && newEvent.start && newEvent.end) {
      const startStr = newEvent.start;
      const endStr = newEvent.end;

      const updateObjects = async () => {
        console.log("updating objects")
        try {
          // const selectedObjects = objects.filter(object => selectedObjectIds.includes(object.object_id));
          
          const promises = selectedObjectIds.map(object => {
            
            return fetch(`http://localhost:3001/objects/${object}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                assignedEvent: newEvent.title,
                imLager: false,
              }),
            });
          });
          await Promise.all(promises);
          // Update the objects state array
          setObjects(objects.map(object => {
            if (selectedObjectIds.includes(object.object_id)) {
              return { ...object, assignedEvent: newEvent.title, imLager: false };
            }
            return object;
          }));
        } catch (error) {
          console.error('Error updating objects:', error);
        }
      };

      const addEvent = async () => {
        try {
          const response = await fetch('http://localhost:3001/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "event_name": newEvent.title,
              "from_date": startStr,
              "until_date": endStr,
            }),
          });
          const data = await response.json();
          
        } catch (error) {
          console.error('Error adding event:', error);
        }
      }
      updateObjects();
      addEvent();
      

      setEvents([
        ...events,
        {
          id: Math.random().toString(),
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
        },
      ]);

      setNewEvent({ title: "", location: "", start: new Date(), end: new Date() });
      setIsModalOpen(false);
    } else {
      alert("Please fill out all fields!");
    }
  };


  const handleEventClick = (e) => {
    
    if (confirm(`Do you want to delete the event '${e.event.title}'?`)) {
      const deletedEventId = async () => {
        try {
          const response = await fetch(`http://localhost:3001/events/${e.event.id}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          console.log(data);
          setEvents(events.filter((event) => event.id !== e.event.id));
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      }
      
      deletedEventId();
      // setEvents(events.filter((event) => event.id !== e.event.id));

    }
  };
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events');
      const data = await response.json();

      const ev = data.events.map((event) => {
        // const [fromDay, fromMonth, fromYear] = event.from_date.split('-');
        // const startDate = new Date(fromYear, fromMonth - 1, fromDay);
        
        // const [untilDay, untilMonth, untilYear] = event.until_date.split('-');
        // const endDate = new Date(untilYear, untilMonth - 1, untilDay);
        
        return {
          id: event.event_id,
          title: event.event_name,
          start: event.from_date,
          end: event.until_date,
        };
      });
      // const updatedObjects = objects.map((object) => {
      //   if (object.assignedEvent === e.event.title) {
      //     // Send request to update object in backend
      //     fetch(`http://localhost:3001/objects/${object.object_id}`, {
      //       method: 'PATCH',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         assignedEvent: null,
      //         imLager: true,
      //       }),
      //     });

      //     return { ...object, assignedEvent: null, imLager: true };
      //   }
      //   return object;
      // });
      // setObjects(updatedObjects);
     
      setEvents(ev || []);
      
     
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
 
  useEffect(() => {
    
    const fetchObjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/objects');
        const data = await response.json();
        const objectsInLager = data.objects.filter(object => object.imLager === 1);
        
        setObjects(objectsInLager);
        
      } catch (error) {
        console.error('Error fetching objects:', error);
      }
    };

    const fetchPeople = async () => {
      try {
        const response = await fetch('http://localhost:3001/people');
        const data = await response.json();
        setPeople(data.people);
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    fetchPeople();
    fetchObjects();
    fetchEvents();
    
  
    
    
  }, []);
  
  return (
    <div className="bg-dark min-h-screen text-light p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Event Calendar</h1>
      
      
        
      <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      eventDisplay="block"
      
      eventBackgroundColor="#007bff" // blue color
      eventTextColor="#ffffff" // white text color
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView="dayGridMonth"
      editable={true}
      selectable={true}
      selectMirror={true}
      events={events}
      // events= {[
      //   { title: events[0].event_name, start: reformatDate(events[1].from_date), end: reformatDate(events[1].until_date) },
      //   { title: 'Event 2', start: '2025-01-06', end: '2024-07-18' }
      // ]}
      key={events.length}
      select={handleDateSelect}
      eventClick={handleEventClick}
      eventContent={(eventInfo) => (
        <>
          {/* <b>{eventInfo.timeText}</b> */}
          <h2 className="text-lg font-bold mb-2 ">{eventInfo.event.title}</h2>
          {objects.map((object) => {
            console.log(object.assignedEvent)
            if (object.assignedEvent === eventInfo.event.title) {
              return <p key={object.object_id}>{object.object_name}</p>; // Display object name
            }
            
          })}
        </>
      )}
      
      />
      
        
      
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add New Event</ModalHeader>
          <ModalBody>
            <form onSubmit={handleAddEvent} onClick={(e) => e.stopPropagation()}>
              <Input
                fullWidth
                color="primary"
                size="lg"
                placeholder="Event Name"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="mb-4"
              />
              <Input
                fullWidth
                color="primary"
                size="lg"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="mb-4"
              />
              <DatePicker
                label="Start Date and Time"
                defaultValue={(parseAbsoluteToLocal(newEvent.start.toISOString()))}
                onChange={(value) => setNewEvent({ ...newEvent, start: value?.toDate() })}
                className="mb-4"
              />
              <DatePicker
                label="End Date and Time"
                defaultValue={(parseAbsoluteToLocal(newEvent.end.toISOString()))}
                onChange={(value) => setNewEvent({ ...newEvent, end: value?.toDate() })}
                // onClick={(value) => setNewEvent({ ...newEvent, end: value })}
                className="mb-4"
              />
              
              <ListboxWrapper>
                
                <Listbox
                  label="Object"
                  classNames={{
                    
                    list: "max-h-40 overflow-y-auto overflow-x-auto",
                  }}
                  defaultSelectedKeys={["1"]}
                  items={objects}
                  selectionMode="multiple"
                  className="mb-4"
                  selectedKeys={selectedObjectIds}
                  onSelectionChange={(selectedKeys) => setSelectedObjectIds(Array.from(selectedKeys))}
                  // onChange={(selectedKeys) => console.log(objects) }
                  >
                    {objects.map((object) => (
                      <ListboxItem key={object.object_id} value={object.object_id}>
                        {object.object_name}
                      </ListboxItem>
                    ))}

                  </Listbox>

              </ListboxWrapper>
              <ListboxWrapper>
                <Listbox
                  label="Person"

                  classNames={{
                    
                    list: "max-h-40 overflow-y-auto overflow-x-auto",
                  }}
                  defaultSelectedKeys={["1"]}
                  items={people}
                  selectionMode="multiple"
                  className="mb-4"
                  >
                    {people.map((person) => (
                      <ListboxItem key={person.person_id} value={person.person_id}>
                        {person.name}
                      </ListboxItem>
                    ))}

                  </Listbox>

              </ListboxWrapper>

              {/* <DateInput
                
                label="Start Date and Time"
                value={(parseAbsoluteToLocal(newEvent.start.toISOString()))}
                onChange={(value) => setNewEvent({ ...newEvent, start: new Date(value?.toString()) })}
                className="mb-4"
              />
              <DateInput
              
                
                label="End Date and Time"
                value={(parseAbsoluteToLocal(newEvent.end.toISOString()))}
                onChange={(value) => setNewEvent({ ...newEvent, end: new Date(value?.toString()) })}
                className="mb-4"
              /> */}
              <Textarea
                fullWidth
                color="primary"
                size="lg"
                placeholder="Description"
                minRows={5}
                // value={newEvent.location}
                // onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="mb-4" 
              />
              <Button type="submit" className="w-full mt-4">
                Add Event
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Calendar;
components/Calendar/Calendar.tsx