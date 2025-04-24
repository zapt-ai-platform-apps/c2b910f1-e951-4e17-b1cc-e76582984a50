import { categories } from '../drizzle/schema.js';
import { initializeDb } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/categories`);

  try {
    const db = initializeDb();

    if (req.method === 'GET') {
      console.log('Fetching all categories');
      const result = await db.select().from(categories).orderBy(categories.name);
      console.log(`Retrieved ${result.length} categories`);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in categories API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}