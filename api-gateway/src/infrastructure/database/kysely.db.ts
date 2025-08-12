import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { UserTable } from './types';

export interface Database {
  users: UserTable ;
  // Add other tables here as you define them
}

// Configure the Kysely instance
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL, // Get connection string from environment variables
    }),
  }),
});