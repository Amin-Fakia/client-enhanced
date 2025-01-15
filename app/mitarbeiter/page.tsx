'use client'
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface Person {
  name: string;
  age: string;
  email: string;
  id: any;
}

const Page = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('http://localhost:3001/people');
        const data = await response.json();
        setPeople(data.people || []); // Ensure data.people is an array
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    fetchPeople();
  }, []);

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age, email }),
      });
      const data = await response.json();
      if (response.ok) {
        setPeople([...people, { name, age, email, id: data.person_id }]);
        setName('');
        setAge('');
        setEmail('');
        onOpenChange(); // Close the modal
      } else {
        console.error('Error adding person:', data.error);
      }
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  return (
    <div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
        </TableHeader>
        <TableBody>
          {people.map((person,index) => (
            <TableRow key={index}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onPress={onOpen} className="mt-4">
        + Add Person
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
          <ModalHeader className="flex flex-col gap-1">Add New Person</ModalHeader>
          <ModalBody>
            <form onSubmit={handleAddPerson}>
              <Input
                fullWidth
                color="primary"
                size="lg"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
              />
              <Input
                fullWidth
                color="primary"
                size="lg"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mb-4"
              />
              <Input
                fullWidth
                color="primary"
                size="lg"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" className="w-full mt-4">
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
