import { Pool } from 'pg';

// Create a singleton pool instance
let pool: Pool | null = null;

export const getConnection = (): Pool => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Log connection errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
};

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Initialize the database schema
export const initDatabase = async (): Promise<void> => {
  const client = await getConnection().connect();

  try {
    // Create the planet_status table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS planet_status (
        planet_id VARCHAR(50) PRIMARY KEY,
        destroyed BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  } finally {
    client.release();
  }
};