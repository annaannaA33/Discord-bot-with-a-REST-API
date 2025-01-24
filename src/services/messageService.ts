import { db } from "../models/db";

export const getRandomTemplate = async (): Promise<string> => {
    const templates = await db
        .selectFrom("templates")
        .selectAll()
        .limit(1)
        .execute();
    if (templates.length === 0) {
        throw new Error("No templates found");
    }
    return templates[0].text;
};
