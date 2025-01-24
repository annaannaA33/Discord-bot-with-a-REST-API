import { Kysely } from "kysely";
import { Database } from "../types/database";

export async function up(db: Kysely<Database>) {
    await db.schema
        .createTable("templates")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("text", "varchar")
        .execute();
}

export async function down(db: Kysely<Database>) {
    await db.schema.dropTable("templates").execute();
}
