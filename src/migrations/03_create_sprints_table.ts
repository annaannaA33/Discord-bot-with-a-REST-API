import { Kysely } from "kysely";
import { Database } from "../types/database";

export async function up(db: Kysely<Database>) {
    await db.schema
        .createTable("sprints")
        .addColumn("code", "varchar", (col) => col.primaryKey().unique())
        .addColumn("title", "varchar", (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<Database>) {
    await db.schema.dropTable("sprints").execute();
}
