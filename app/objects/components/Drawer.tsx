import { Drawer, DrawerContent,Divider, DrawerHeader, DrawerBody, Button, Select ,SelectItem,Chip} from "@nextui-org/react";

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
  );
};

export default DetailsDrawer;