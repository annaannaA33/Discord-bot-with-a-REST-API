import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("sprints")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("code", "integer")
        .addColumn("title", "varchar")
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("sprints").execute();
}
