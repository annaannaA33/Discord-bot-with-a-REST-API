import { Kysely } from "kysely";
import { Database } from "../types/database";

export async function up(db: Kysely<Database>) {
    await db.schema
        .createTable("messages")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("username", "varchar")
        .addColumn("sprintCode", "integer")
        .addColumn("message", "varchar")
        .addColumn("gifUrl", "varchar")
        .addColumn("createdAt", "datetime", (col) =>
            col.defaultTo("CURRENT_TIMESTAMP")
        )
        .execute();

}

export async function down(db: Kysely<Database>) {
    await db.schema.dropTable("messages").execute();
}
