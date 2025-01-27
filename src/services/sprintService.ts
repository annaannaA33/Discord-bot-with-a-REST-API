import { Kysely } from "kysely";
import { Database } from "../types/database";

export async function getSprintTitle(
    db: Kysely<Database>, // db передается через DI
    sprintCode: number
): Promise<string | null> {
    if (!db) {
        console.error("db is undefined in getSprintTitle!");
        throw new Error("Database is undefined");
    }
    const sprint = await db
        .selectFrom("sprints")
        .select("title")
        .where("code", "=", sprintCode)
        .executeTakeFirst();

    return sprint ? sprint.title : null;
}
