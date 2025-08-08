import * as path from 'path';
import { promises as fs } from 'fs';
import {
 Migrator,
 FileMigrationProvider,
  MigrationResultSet,
} from 'kysely';
import { db } from './src/infrastructure/database/kysely.db';

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    // This is the directory where your migration files are located.
    // It's relative to the directory where you run the migration script.
    migrationFolder: path.join(__dirname, 'src/infrastructure/database/migrations'),
  }),
});

async function runMigrations(): Promise<void> {
  console.log('Running migrations...');
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  console.log('migrations finished');
  // It's good practice to close the database connection pool after migrations
  // if this script is the only one using it.
  await db.destroy();
}

runMigrations();