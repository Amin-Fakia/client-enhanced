import { Drawer, DrawerContent,Divider, DrawerHeader, DrawerBody, Button, Select ,SelectItem,Chip,Textarea} from "@nextui-org/react";

import { useState } from "react";
interface Object {
  object_id: number;
  object_name: string;
  imLager: boolean;
  categorie: string;
  beschreibung: string;
  assignedEvent?: string;
  notizen: string;
}

interface Event {
  event_id: number;
  event_name: string;
}

interface DetailsDrawerProps {
  selectedObject: Object | null;
  events: Event[];
  selectedEventId: number | null;
  setSelectedEventId: (id: number | null) => void;
  handleAssignToEvent: () => void;
  handleRemoveFromEvent: () => void;
  isDrawerOpen: boolean;
  onDrawerOpenChange: () => void;
}

const DetailsDrawer: React.FC<DetailsDrawerProps> = ({
  selectedObject,
  events,
  selectedEventId,
  setSelectedEventId,
  handleAssignToEvent,
  handleRemoveFromEvent,
  isDrawerOpen,
  onDrawerOpenChange,
}) => {
  const [notizen, setNotizen] = useState(selectedObject?.notizen?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);


  const handleDescriptionChange = async () => {
    const response = await fetch('http://localhost:3001/objects/' + selectedObject?.object_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notizen: notizen,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update object');
    }
    setNotizen(response.ok? (await response.json()).notizen : '');
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 500); // Reset after 2 seconds
    
  };
  return (
    <Drawer placement='right' onClose={onDrawerOpenChange} isOpen={isDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>Equipment Details</DrawerHeader>
        <Divider className="my-4" />
        <DrawerBody>
          {selectedObject && (
            <>
                
                
              <p><strong> Name:</strong> {selectedObject.object_name}</p>
              <Divider orientation="horizontal" />
              <p><strong> Categorie:</strong> {selectedObject.categorie}</p>
              <Divider orientation="horizontal" />
              <p><strong> Beschreibung:</strong> {selectedObject.beschreibung}</p>
              <Divider orientation="horizontal" />
              <p><strong> Im Lager: </strong>{selectedObject.imLager ? 'Ja' : 'Nein'}</p>
              
              {selectedObject.assignedEvent ? (

                <> 
                <p>Wird am Event eingesetzt: {selectedObject.assignedEvent}</p>
                <Button onPress={handleRemoveFromEvent}>Remove from Event</Button>
                </>
                
              ) : (
                <>
                  <Select
                    placeholder="Select Event"
                    onChange={(e) => setSelectedEventId(Number(e.target.value))}
                    disabled={!selectedObject.imLager}
                  >
                    {events.map(event => (
                      <SelectItem key={event.event_id} value={event.event_id}>
                        {event.event_name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    onPress={handleAssignToEvent}
                    isLoading={isSaving}
                    
                    disabled={!selectedObject.imLager || selectedEventId === null}
                  >
                    Assign to Event
                  </Button>
                </>
              )}
              {/* HandleOnChange object.Beschreibung parameter post request */}
              <Textarea
            className="max-w mt-5"
            label="Notizen"
            // value={description}
            defaultValue={selectedObject.notizen }
            placeholder=""
            minRows={10}
           
            onValueChange={(description) => setNotizen(description)}
            />
            <Button 
            className="mt-4"
             onPress={handleDescriptionChange}
              color={saveSuccess ? 'success' : 'primary'}
              startContent={saveSuccess ? "Loading": ""}>{saveSuccess ? "Gespeichert " : "Speichern" } </Button>
            </>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailsDrawer;