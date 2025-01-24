import { describe, it, expect, vi } from "vitest";
import { validateMessageRequest } from "./validationService";
import { getSprintTitle } from "./sprintService";

// Мокаем функцию getSprintTitle
vi.mock("./sprintService", () => ({
    getSprintTitle: vi.fn(),
}));

const mockedGetSprintTitle = getSprintTitle as ReturnType<typeof vi.fn>;

describe("validateMessageRequest", () => {
    it("should throw an error if username is missing", async () => {
        await expect(validateMessageRequest("", 1)).rejects.toThrow(
            "Username and valid sprintCode are required"
        );
    });

    it("should throw an error if sprintCode is NaN", async () => {
        await expect(validateMessageRequest("testUser", NaN)).rejects.toThrow(
            "Username and valid sprintCode are required"
        );
    });

    it("should throw an error if sprintTitle is not found", async () => {
        mockedGetSprintTitle.mockResolvedValueOnce(null);

        await expect(validateMessageRequest("testUser", 1)).rejects.toThrow(
            "Sprint not found"
        );
    });

    it("should return sprintTitle if validation passes", async () => {
        mockedGetSprintTitle.mockResolvedValueOnce("Sprint 1");

        const result = await validateMessageRequest("testUser", 1);

        expect(result).toBe("Sprint 1");
        expect(mockedGetSprintTitle).toHaveBeenCalledWith(1);
    });

    it("should call getSprintTitle with the correct sprintCode", async () => {
        mockedGetSprintTitle.mockResolvedValueOnce("Sprint 2");

        await validateMessageRequest("anotherUser", 2);

        expect(mockedGetSprintTitle).toHaveBeenCalledWith(2);
    });
});
