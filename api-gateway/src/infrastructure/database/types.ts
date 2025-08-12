export interface UserTable {
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
}