import { useState, useEffect } from 'react';
import axios from 'axios';

interface Person {
    id: number;
    name: string;
    age: number;
}

const usePeople = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPeople = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3001/people');
            setPeople(response.data);
        } catch (err) {
            setError('Failed to fetch people');
        } finally {
            setLoading(false);
        }
    };

    const addPerson = async (person: Person) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:3001/people', person);
            setPeople([...people, response.data]);
        } catch (err) {
            setError('Failed to add person');
        } finally {
            setLoading(false);
        }
    };

    const deletePerson = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`http://localhost:3001/people/${id}`);
            setPeople(people.filter(person => person.id !== id));
        } catch (err) {
            setError('Failed to delete person');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    return { people, loading, error, addPerson, deletePerson };
};

export default usePeople;