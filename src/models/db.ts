import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { config } from "dotenv"

config();
export const db = new Kysely({
    dialect: new SqliteDialect({
        database: new Database(process.env.DATABASE_URL || "./database.sqlite"), // Используем better-sqlite3
    }),
});
