import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { Database as DbTypes } from "../types/database";
import { config } from "dotenv";

config();
export const db = new Kysely<DbTypes>({
    dialect: new SqliteDialect({
        database: new Database(process.env.DATABASE_URL || "./database.sqlite"),
    }),
});
