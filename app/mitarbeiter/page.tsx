
'use client'
import React from 'react'
import { faker } from '@faker-js/faker';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
const generatePeople = (count = 10) => {
    
    return Array.from({ length: count }).map(() => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
    }));
  };

const page = () => {
    const people = generatePeople();
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>AVATAR</TableColumn>
      </TableHeader>
      <TableBody>
        {people.map((person) => (
          <TableRow key={person.id}>
            <TableCell>{person.name}</TableCell>
            <TableCell>{person.email}</TableCell>
            <TableCell>
              <img 
                src={person.avatar} 
                alt={`${person.name}'s avatar`} 
                style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default page