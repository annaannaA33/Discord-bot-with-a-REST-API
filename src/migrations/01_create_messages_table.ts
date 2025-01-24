import { Kysely, MigrationContext } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("messages")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("username", "varchar")
        .addColumn("sprintCode", "varchar")
        .addColumn("message", "varchar")
        .addColumn("gifUrl", "varchar")
        .addColumn("createdAt", "datetime", (col) =>
            col.defaultTo("CURRENT_TIMESTAMP")
        )
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("messages").execute();
}
