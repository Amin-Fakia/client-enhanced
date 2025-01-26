// /pages/api/events.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Fetch events from your backend
      const events = await fetch('http://localhost:3001/api/events').then(res => res.json());
      res.status(200).json(events);
      break;

    case 'POST':
      // Add new event
      const newEvent = req.body;
      const createdEvent = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
      }).then(res => res.json());
      res.status(201).json(createdEvent);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
