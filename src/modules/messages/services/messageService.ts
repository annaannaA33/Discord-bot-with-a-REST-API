//import { db } from "../db/db";
import { Kysely } from "kysely";
import { Database } from "../../../types/database";
import { sql } from "kysely";
import { Template } from "../../../types/database";

export const getRandomTemplate = async (
    db: Kysely<Database>
): Promise<string> => {
    const templates: Template[] = await db
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
