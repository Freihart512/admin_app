import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Define the database schema types based on your User entity
export interface Database {
  users: {
    id: string;
    email: string;
    password_hash: string; // Snake case for database column
    is_admin: boolean; // Snake case for database column
    roles: string; // Storing roles as a JSON string
    name: string;
    last_name: string;
    phone_number: string | null; // Optional field, nullable in DB
    address: string | null; // Optional field, nullable in DB
    rfc: string | null; // Optional field, nullable in DB
    status: 'active' | 'inactive'; // Using the same status type as domain
    created_at: Date;
    created_by: string;
    updated_at: Date | null;
    updated_by: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
  };
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