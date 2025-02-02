import { getSprintTitle } from "./sprintService";
import { Kysely } from "kysely";
import { Database } from "../../../types/database";


export async function validateMessageRequest(
    db: Kysely<Database>,
    username: string,
    sprintCode: string
): Promise<string> {
    try {
        if (!username || username.trim() === "") {
            throw new Error("Enter username");
        }
        if (!sprintCode || sprintCode.trim() === "") {
            throw new Error("Enter sprintCode");
        }
        const sprintTitle = await getSprintTitle(db, sprintCode);
        if (!sprintTitle) {
            throw new Error(`Sprint with code "${sprintCode}" not found`);
        }
        return sprintTitle;
    } catch (error) {
        throw error;
    }
}
