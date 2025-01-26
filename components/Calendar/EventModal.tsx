import React, { useState } from "react";
import { Modal, ModalContent,Textarea, ModalHeader, ModalBody, Input, Button, DatePicker, Listbox, ListboxItem } from "@nextui-org/react";
import { parseAbsoluteToLocal} from "@internationalized/date";
import ListboxWrapper from "./ListboxWrapper";
export const EventModal = ({ isOpen, onClose, onAddEvent, objects, people, dateRange, calendarRef}) => {
  const [event, setEvent] = useState({
    title: "",
    location: "",
    start: (parseAbsoluteToLocal(dateRange.start.toISOString())),
    end: (parseAbsoluteToLocal(dateRange.end.toISOString())),
    selectedObjectIds: [],
    selectedPeopleIds: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    calendarRef.current.getApi().refetchEvents();
    onAddEvent(event);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Event</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Input
              fullWidth
              color="primary"
              size="lg"
              placeholder="Event Name"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="mb-4"
              />
              <Input
                fullWidth
                color="primary"
                size="lg"
                placeholder="Location"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                className="mb-4"
                />
            <DatePicker
              label="Start Date"
              defaultValue={event.start}
              // value={event.start}
              onChange={(value) => setEvent({ ...event, start: value })}
              className="mb-4"
            />
            <DatePicker
              label="End Date"
              value={event.end}
              onChange={(value) => setEvent({ ...event, end: value })}
              className="mb-4"
            />
            <ListboxWrapper>
              <Listbox
                label="Objects"
                classNames={{
                    
                  list: "max-h-40 overflow-y-auto overflow-x-auto",
                }}
                items={objects}
                selectedKeys={event.selectedObjectIds}
                selectionMode="multiple"
                onSelectionChange={(keys) => setEvent({ ...event, selectedObjectIds: keys })}
              >
                  {objects.map((object,obj_idx) => (
                    <ListboxItem key={obj_idx} value={object.object_id}>
                      {object.object_name}
                    </ListboxItem>
                  ))}
                
              </Listbox>
            </ListboxWrapper>

            <ListboxWrapper>
              <Listbox
                label="People"
                classNames={{
                  list: "max-h-40 overflow-y-auto overflow-x-auto",
                }}
                items={people}
                selectedKeys={event.selectedPeopleIds}
                onSelectionChange={(keys) => setEvent({ ...event, selectedPeopleIds: keys })}
              >
                {people.map((person,people_idx) => (
                  <ListboxItem key={people_idx} value={person.id}>
                    {person.name}
                  </ListboxItem>
                ))}
              </Listbox>
            </ListboxWrapper>
            <Textarea
                fullWidth
                color="primary"
                size="lg"
                placeholder="Description"
                minRows={5}
                className="mb-4" 
              />
            
            

            <Button type="submit">Add Event</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
