import { Kysely, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { up, down } from "../01_create_messages_table";
import { expect, describe, it, beforeEach, afterEach } from "vitest";

interface TestDatabase {
    messages: {
        id: number;
        username: string;
        sprintCode: string;
        message: string;
        gifUrl: string;
        createdAt: string;
    };
}

let db: Kysely<TestDatabase>;

describe("Migration: create_messages_table", () => {
    beforeEach(() => {
        const sqlite = new Database(":memory:");
        db = new Kysely<TestDatabase>({
            dialect: new SqliteDialect({ database: sqlite }),
        });
    });

    afterEach(async () => {
        await db.destroy();
    });

    it("should create the messages table with correct columns", async () => {
        await up(db);

        const result = await db
            .selectFrom("sqlite_master")
            .select(["name", "sql"])
            .where("type", "=", "table")
            .where("name", "=", "messages")
            .executeTakeFirst();

        expect(result).toBeDefined();
        expect(result?.name).toBe("messages");

        const columns = await db
            .selectFrom('pragma_table_info("messages")')
            .select(["name"])
            .execute();

        const columnNames = columns.map((col) => col.name);
        expect(columnNames).toEqual([
            "id",
            "username",
            "sprintCode",
            "message",
            "gifUrl",
            "createdAt",
        ]);
    });

    it("should drop the messages table on down migration", async () => {
        await up(db);
        await down(db);

        const result = await db
            .selectFrom("sqlite_master")
            .select(["name"])
            .where("type", "=", "table")
            .where("name", "=", "messages")
            .executeTakeFirst();

        expect(result).toBeUndefined();
    });
});
