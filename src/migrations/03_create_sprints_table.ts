import { Kysely, MigrationContext } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("sprints")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("code", "varchar")
        .addColumn("title", "varchar")
        .addColumn("createdAt", "datetime", (col) =>
            col.defaultTo("CURRENT_TIMESTAMP")
        )
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("sprints").execute();
}
