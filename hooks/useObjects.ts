import { useState, useEffect } from "react";

interface Object {
  object_id: number;
  object_name: string;
  imLager: boolean;
  categorie: string;
  beschreibung: string;
  assignedEvent?: string;
}

export const useObjects = () => {
  const [objects, setObjects] = useState<Object[]>([]);

  const fetchObjects = async () => {
    try {
      const response = await fetch("http://localhost:3001/objects");
      const data = await response.json();
      setObjects(data.objects || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addObject = async (object) => {
    try {
      const response = await fetch("http://localhost:3001/objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
      const newObject = await response.json();
      setObjects(prev => [...prev, newObject]);
    } catch (error) {
      console.error("Error adding object:", error);
    }
  };

  const deleteObject = async (id) => {
    try {
      await fetch(`http://localhost:3001/objects/${id}`, { method: "DELETE" });
      setObjects(prev => prev.filter(object => object.id !== id));
    } catch (error) {
      console.error("Error deleting object:", error);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  return { objects, addObject, deleteObject };
};
