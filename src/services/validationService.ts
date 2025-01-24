import { getSprintTitle } from "./sprintService";

export async function validateMessageRequest(
    username: string,
    sprintCode: number
): Promise<string> {
    
    if (!username || isNaN(sprintCode)) {
        throw new Error("Username and valid sprintCode are required");
    }

    const sprintTitle = await getSprintTitle(sprintCode);
    if (!sprintTitle) {
        throw new Error("Sprint not found");
    }

    return sprintTitle;
}
