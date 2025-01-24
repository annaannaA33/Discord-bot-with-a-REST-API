import { Kysely, SqliteDialect } from "kysely";
import sqlite3 from "sqlite3";

export const db = new Kysely({
    dialect: new SqliteDialect({
        database: new sqlite3.Database(
            process.env.DATABASE_URL || "./database.sqlite"
        ),
    }),
});
