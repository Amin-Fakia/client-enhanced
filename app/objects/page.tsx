'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader,useDisclosure, ModalContent, Input} from '@nextui-org/react';

interface Object {
  object_id:any,
  object_name: string,
  ausgeliehen: boolean
}

const FakeObjectsTable = () => {
    const [objects, setObjects] = useState<Object[]>([]);
    const [objectName, setObjectName] = useState('');
    const [ausgeliehen, setAusgeliehen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
      useEffect(() => {
        const fetchObjects = async () => {
          try {
            const response = await fetch('http://localhost:3001/objects');
            const data = await response.json();
            setObjects(data.objects || []); // Ensure data.people is an array
            
          } catch (error) {
            console.error('Error fetching objects:', error);
          }
        };
    
        fetchObjects();
      }, []);

        const handleAddObject = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
            const response = await fetch('http://localhost:3001/objects', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ "object_name":objectName, "ausgeliehen": ausgeliehen }),
            });
            const data = await response.json();
            if (response.ok) {
              setObjects([...objects, { object_name: objectName, ausgeliehen, object_id: data.object_id }]);
              setObjectName('');
              setAusgeliehen(false);
              onOpenChange();
            } else {
              console.error('Error adding person:', data.error);
            }
          } catch (error) {
            console.error('Error adding person:', error);
          }
        };
  
    return (
      <div>
        <Table aria-label="Example objects table">
        <TableHeader>
          <TableColumn>OBJECT ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>AUSGELIEHEN</TableColumn>
        </TableHeader>
        <TableBody>
          {objects.map((obj) => (
            <TableRow key={obj.object_id}>
              <TableCell>{obj.object_id}</TableCell>
              <TableCell>{obj.object_name}</TableCell>
              <TableCell>{obj.ausgeliehen ? 'Ausgeliehen' : 'Nicht Ausgeliehen'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onPress={onOpen} className="mt-4">
        + Add Object
      </Button>

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
          <ModalHeader><h2>Add New Object</h2></ModalHeader>
          <ModalBody>
            <form onSubmit={handleAddObject}>
              <Input
              
                fullWidth
                color="primary"
                size="lg"
                placeholder="Object Name"
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
              />
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={ausgeliehen}
                    onChange={(e) => setAusgeliehen(e.target.checked)}
                  />
                  <span className="ml-2">Ausgeliehen</span>
                </label>
              </div>
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
  
  export default FakeObjectsTable;