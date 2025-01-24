import { db } from "../models/db";
import { sql } from "kysely";

export const getRandomTemplate = async (): Promise<string> => {
    const templates = await db
        .selectFrom("templates")
        .selectAll()
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .execute();
    if (templates.length === 0) {
        throw new Error("No templates found");
    }
    return templates[0].text;
};
