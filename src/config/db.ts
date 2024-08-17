import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: import.meta.env.BD_HOST,
    port: parseInt(import.meta.env.BD_PORT),
    user: import.meta.env.BD_USER,
    password: import.meta.env.BD_PASSWORD,
    database: import.meta.env.BD_NAME,
})