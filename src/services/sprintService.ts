import { db } from "../db/db";

export async function getSprintTitle(
    sprintCode: number
): Promise<string | null> {
    const sprint = await db
        .selectFrom("sprints")
        .select("title")
        .where("code", "=", sprintCode)
        .executeTakeFirst();

    return sprint ? sprint.title : null;
}
