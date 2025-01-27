import { db } from "../db/db";

interface SaveMessageParams {
    username: string;
    sprintCode: string;
    message: string;
    gifUrl: string;
}

export async function saveMessage({
    username,
    sprintCode,
    message,
    gifUrl,
}: SaveMessageParams): Promise<void> {
    await db
        .insertInto("messages")
        .values({
            username,
            sprintCode,
            message,
            gifUrl,
        })
        .execute();
}
