import { getSprintTitle } from "./sprintService";
import { Kysely } from "kysely";
import { Database } from "../../../types/database";

export async function validateMessageRequest(
    db: Kysely<Database>,
    username: string,
    sprintCode: string
): Promise<string> {
    if (!username || !sprintCode.trim()) {
        throw new Error("Username and valid sprintCode are required");
    }

    const sprintTitle = await getSprintTitle(db, sprintCode);
    if (!sprintTitle) {
        throw new Error("Sprint not found");
    }

    return sprintTitle;
}
