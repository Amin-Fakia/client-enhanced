'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { faker } from '@faker-js/faker';

// Function to generate fake object data
const generateObjects = (count = 10) => {
  return Array.from({ length: count }).map(() => ({
    object_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    ausgeliehen: faker.datatype.boolean(),
  }));
};


const FakeObjectsTable = () => {
    const objects = generateObjects();
  
    return (
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
              <TableCell>{obj.name}</TableCell>
              <TableCell>{obj.ausgeliehen ? 'Ausgeliehen' : 'Nicht Ausgeliehen'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default FakeObjectsTable;