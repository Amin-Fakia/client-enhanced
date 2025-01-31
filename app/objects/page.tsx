

'use client'
import { useState } from 'react';
import { Input } from "@nextui-org/react";
import { useFetchData } from '@/hooks/fetchObjects';
import ObjectsTable from './components/Table';
import DetailsDrawer from './components/Drawer';
import { useDisclosure, Button } from '@nextui-org/react';
import CustomModal from '@/components/CustomModal';


interface Object {
  object_id: number;
  object_name: string;
  imLager: boolean;
  categorie: string;
  beschreibung: string;
  assignedEvent?: string;
}
const ObjectsPage = () => {
  const { objects, events, setObjects } = useFetchData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObject, setSelectedObject] = useState<Object | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange } = useDisclosure();
  const [newObjectName, setNewObjectName] = useState('');
  const [newCategorie, setNewCategorie] = useState('');
  const [newBeschreibung, setNewBeschreibung] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter objects based on search query
  const filteredObjects = objects.filter(object =>
    object.object_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered objects by category
  const groupedObjects = filteredObjects.reduce((acc, object) => {
    if (!acc[object.categorie]) {
      acc[object.categorie] = [];
    }
    acc[object.categorie].push(object);
    return acc;
  }, {} as Record<string, Object[]>);

  // Add "All" category
  groupedObjects["All"] = filteredObjects;

  const handleShowDetails = (object: Object) => {
    setSelectedObject(object);
    onDrawerOpen();
  };

/**
 * Assigns the selected object to the specified event.

 */

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
            setSelectedObject({ ...selectedObject, assignedEvent: selectedEvent.event_name, imLager: false });
            setObjects(objects.map(obj => obj.object_id === selectedObject.object_id ? { ...obj, assignedEvent: selectedEvent.event_name, imLager: false } : obj));
          } else {
            console.error('Error updating object:', await response.json());
          }
        } catch (error) {
          console.error('Error updating object:', error);
        }
      }
    }
  };
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
  const handleRemoveFromEvent = async () => {
        try {
          const response = await fetch(`http://localhost:3001/objects/${selectedObject.object_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assignedEvent: null, imLager: true }), // Also set imLager to true
          });
      
          if (response.ok) {
            setSelectedObject({ ...selectedObject, assignedEvent: null, imLager: true });
            setObjects(objects.map(obj => obj.object_id === selectedObject.object_id ? { ...obj, assignedEvent: null, imLager: true } : obj));
          } else {
            console.error('Error removing object from event:', await response.json());
          }
        } catch (error) {
          console.error('Error removing object from event:', error);
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
      <ObjectsTable groupedObjects={groupedObjects} handleShowDetails={handleShowDetails} />
      <DetailsDrawer
        selectedObject={selectedObject}
        events={events}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        handleAssignToEvent={handleAssignToEvent}
        handleRemoveFromEvent={handleRemoveFromEvent}
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={onDrawerOpenChange}
      />
                <Button onPress={()=>setIsOpen(!isOpen)} className='mt-5'>+ Neues Equipment</Button>
      <CustomModal isOpen={isOpen} onOpenChange={()=>setIsOpen(!isOpen)} headerText='Neues Equipment'>
        <form onSubmit={handleAddObject}>
            <Input
              type="text"
              placeholder="Object Name"
              value={newObjectName}
              onChange={(e) => setNewObjectName(e.target.value)}
              className='mb-5'
              isRequired
            />
            <Input
              type="text"
              placeholder="Categorie"
              value={newCategorie}
              onChange={(e) => setNewCategorie(e.target.value)}
              className='mb-5'
              isRequired
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