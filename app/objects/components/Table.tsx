import { Accordion, AccordionItem, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Button } from "@nextui-org/react";

interface Object {
  object_id: number;
  object_name: string;
  imLager: boolean;
  categorie: string;
  beschreibung: string;
  assignedEvent?: string;
}

interface ObjectsTableProps {
  groupedObjects: Record<string, Object[]>;
  handleShowDetails: (object: Object) => void;
}

const ObjectsTable: React.FC<ObjectsTableProps> = ({ groupedObjects, handleShowDetails }) => {
  return (
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
                  <TableCell><Button onPress={() => handleShowDetails(object)}>Show Details</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ObjectsTable;