// infrastructure/database/types.ts
import { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

export interface UsersTable {
  id: string;
  email: string;
  password_hash: string;
  is_admin: boolean;
  roles: ColumnType<unknown, unknown | undefined, unknown | undefined>; // jsonb
  name: string;
  last_name: string;
  phone_number: string | null;
  address: string | null;
  rfc: string | null;
  status: 'active' | 'inactive';
  created_at: ColumnType<Date, Date | undefined, Date | undefined>;
  created_by: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  updated_at: ColumnType<Date | null, Date | null | undefined, Date | null | undefined>;
  updated_by: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  deleted_at: ColumnType<Date | null, Date | null | undefined, Date | null | undefined>;
  deleted_by: ColumnType<string | null, string | null | undefined, string | null | undefined>;
}

export type UserRow    = Selectable<UsersTable>;
export type NewUser    = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

// Si también tienes Database:
export interface Database {
  users: UsersTable;
}
