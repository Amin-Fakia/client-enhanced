'use client'
import { useEffect, useState } from 'react';
import {Accordion, AccordionItem, Button,Chip,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,Card,CardHeader,CardFooter,CardBody,
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Select,
  useDisclosure,
   SelectItem} from "@nextui-org/react";
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
import CustomModal from '@/components/CustomModal';





const ObjectsPage = () => {
  const [objects, setObjects] = useState<Object[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [newObjectName, setNewObjectName] = useState('');
  const [newCategorie, setNewCategorie] = useState('');
  const [newBeschreibung, setNewBeschreibung] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange } = useDisclosure();
  const [selectedObject, setSelectedObject] = useState<Object>();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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
    fetchEvents();

    fetchObjects();
  }, []);

   // Filter objects based on search query
   const filteredObjects = objects.filter(object =>
    object.object_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // grouping objects based on category

  const groupedObjects = objects.reduce((acc, object) => {
    if (!acc[object.categorie]) {
      acc[object.categorie] = [];
    }
    acc[object.categorie].push(object);
    return acc;
  }, {} as Record<string, Object[]>);


  groupedObjects["Alle"] = filteredObjects;


  const handleAddObject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/objects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "object_name": newObjectName,
          "imLager": true,
          "categorie": newCategorie,
          "beschreibung": newBeschreibung,
        }),
      });
      const data = await response.json();  
      if (response.ok) {
        // Assuming the newly created object is returned in the 'data' object
       
        setObjects([...objects, data]);
        setNewObjectName('');
        setNewCategorie('');
        setNewBeschreibung('');
        setIsOpen(false);
      } else {
        console.error('Error adding object:', data.error);
      }
    } catch (error) {
      console.error('Error adding object:', error);
    }
  };

  const handleShowDetails = (object: Object) => {
    setSelectedObject(object);
    onDrawerOpen();
  };
  const handleAssignToEvent = async () => {
    if (selectedObject && selectedEventId !== null) {
      const selectedEvent = events.find(event => event.event_id === selectedEventId);
      
      if (selectedEvent) {
        try {
          const response = await fetch(`http://localhost:3001/objects/${selectedObject.object_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assignedEvent: selectedEvent.event_name, imLager: false }),
          });

          if (response.ok) {
            setSelectedObject({ ...selectedObject, assignedEvent: selectedEvent.event_name });
            setObjects(objects.map(obj => obj.object_id === selectedObject.object_id ? { ...obj, assignedEvent: selectedEvent.event_name, imLager: false} : obj));
          } else {
            console.error('Error updating object:', await response.json());
          }
        } catch (error) {
          console.error('Error updating object:', error);
        }
      }
    }
  };
  return (
    <div>
      <Input
        type="text"
        placeholder="Equipments suchen..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='mb-5'
      />
      
      <Accordion variant="shadow">
        {Object.keys(groupedObjects).map((category) => (
          <AccordionItem key={category} title={category}>
            <Table aria-label="Example table with dynamic content" className='' selectionMode="single">
              <TableHeader>
                <TableColumn>Object Name</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Im Lager</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {groupedObjects[category].map((object) => (
                  <TableRow key={object.object_id}>
                    <TableCell>{object.object_name}</TableCell>
                    <TableCell>{object.categorie}</TableCell>
                    <TableCell><Chip color={object.imLager ? 'success' : 'danger'} >{object.imLager ? 'Im Lager' : 'Nicht Im Lager'}</Chip></TableCell>
                    <TableCell><Button onPress={()=>handleShowDetails(object)}>Show Details</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            
          </AccordionItem>
        ))}
      </Accordion>
      <Drawer placement='right' onClose={onDrawerOpenChange} isOpen={isDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>Equipment Details</DrawerHeader>
          <DrawerBody>
            {selectedObject && (
              <>
                <p>Name: {selectedObject.object_name}</p>
                <p>Categorie: {selectedObject.categorie}</p>
                <p>Beschreibung: {selectedObject.beschreibung}</p>
                <p>Im Lager: {selectedObject.imLager ? 'Ja' : 'Nein'}</p>
                {selectedObject.assignedEvent ? (
                  <p>Assigned to Event: {selectedObject.assignedEvent} {selectedObject.imLager == false}</p>
                  
                ) : (
                  <>
                    <Select
                      placeholder="Select Event"
                      onChange={(e) => setSelectedEventId(Number(e.target.value))}
                      disabled={!selectedObject.imLager}
                    >
                      {events.map(event => (
                        <SelectItem  key={event.event_id} value={event.event_id}>
                          {event.event_name}
                        </SelectItem >
                      ))}
                    </Select>
                    <Button
                      onPress={handleAssignToEvent}
                      disabled={!selectedObject.imLager || selectedEventId === null}
                    >
                      Assign to Event
                    </Button>
                  </>
                )}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
     
      

      {/*  */}
      <Button onPress={()=>setIsOpen(!isOpen)} className='mt-5'>+ Neues Equipment</Button>
      <CustomModal isOpen={isOpen} onOpenChange={()=>setIsOpen(!isOpen)}>
        <form onSubmit={handleAddObject}>
            <Input
              type="text"
              placeholder="Object Name"
              value={newObjectName}
              onChange={(e) => setNewObjectName(e.target.value)}
              className='mb-5'
            />
            <Input
              type="text"
              placeholder="Categorie"
              value={newCategorie}
              onChange={(e) => setNewCategorie(e.target.value)}
              className='mb-5'
            />
            <Input
              type="text"
              placeholder="Beschreibung"
              value={newBeschreibung}
              onChange={(e) => setNewBeschreibung(e.target.value)}
              className='mb-5'
            />

            <Button type="submit" className="w-full mt-4">
              Submit
            </Button>
        </form>
      </CustomModal>
      
    </div>
  );
};
export default ObjectsPage;