import { Kysely, MigrationContext } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("templates")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("text", "varchar")
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("templates").execute();
}
