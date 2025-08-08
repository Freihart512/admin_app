// kysely.config.ts
import { Pool } from 'pg'
import { PostgresDialect } from 'kysely'
import { FileMigrationProvider } from 'kysely'
import { promises as fs } from 'fs'
import path from 'path'
import 'dotenv/config'; 

export default {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  migrationTableName: 'kysely_migrations',
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, '/infrastructure/database/migrations'),
  }),
}
