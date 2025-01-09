'use client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { faker } from '@faker-js/faker';

const generateEvents = (count = 10) => {
    return Array.from({ length: count }).map(() => ({
      id: faker.string.uuid(),
      location: faker.location.city(),
      from_when: faker.date.past().toISOString(),
      until_when: faker.date.future().toISOString(),
      people: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => faker.person.fullName()),
      objects: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => faker.commerce.product()),
    }));
  };
  
  const eventsPage = () => {
    const events = generateEvents();
  
    return (
      <Table aria-label="Example events table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>LOCATION</TableColumn>
          <TableColumn>FROM WHEN</TableColumn>
          <TableColumn>UNTIL WHEN</TableColumn>
          <TableColumn>PEOPLE</TableColumn>
          <TableColumn>OBJECTS</TableColumn>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{new Date(event.from_when).toLocaleString()}</TableCell>
              <TableCell>{new Date(event.until_when).toLocaleString()}</TableCell>
              <TableCell>{event.people.join(', ')}</TableCell>
              <TableCell>{event.objects.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default eventsPage;