import { Kysely } from "kysely";
import { Database } from "../types/database";

export async function up(db: Kysely<Database>) {
    await db.schema
        .createTable("sprints")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("code", "integer")
        .addColumn("title", "varchar")
        .execute();
}

export async function down(db: Kysely<Database>) {
    await db.schema.dropTable("sprints").execute();
}
