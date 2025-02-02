import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateMessageRequest } from "./validationService";
import { getSprintTitle } from "./sprintService";
import { Kysely } from "kysely";
import { Database } from "../../../types/database";

vi.mock("./sprintService", () => ({
    getSprintTitle: vi.fn(),
}));

const mockDb = {
    selectFrom: vi.fn(),
};

const mockedGetSprintTitle = getSprintTitle as ReturnType<typeof vi.fn>;

describe("validateMessageRequest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw an error if username is missing", async () => {
        await expect(
            validateMessageRequest(
                mockDb as unknown as Kysely<Database>,
                "",
                "WD-1.1"
            )
        ).rejects.toThrow("Enter username");
    });

    it("should throw an error if username is empty", async () => {
        await expect(
            validateMessageRequest(
                mockDb as unknown as Kysely<Database>,
                "",
                "WD-1.1"
            )
        ).rejects.toThrow("Enter username");
    });

    it("should throw an error if sprintCode is missing", async () => {
        await expect(
            validateMessageRequest(
                mockDb as unknown as Kysely<Database>,
                "testUser",
                ""
            )
        ).rejects.toThrow("Enter sprintCode");
    });

    it("should throw an error if sprintCode is empty", async () => {
        await expect(
            validateMessageRequest(
                mockDb as unknown as Kysely<Database>,
                "testUser",
                ""
            )
        ).rejects.toThrow("Enter sprintCode");
    });

    it("should throw an error if sprintTitle is not found", async () => {
        mockedGetSprintTitle.mockResolvedValueOnce(null);
        await expect(
            validateMessageRequest(
                mockDb as unknown as Kysely<Database>,
                "testUser",
                "WD-1.1"
            )
        ).rejects.toThrow('Sprint with code "WD-1.1" not found');
    });

    it("should return sprintTitle if validation passes", async () => {
        mockedGetSprintTitle.mockResolvedValueOnce("Sprint 1");
        const result = await validateMessageRequest(
            mockDb as unknown as Kysely<Database>,
            "testUser",
            "WD-1.1"
        );
        expect(result).toBe("Sprint 1");
        expect(mockedGetSprintTitle).toHaveBeenCalledWith(mockDb, "WD-1.1");
    });

    it("should call getSprintTitle with the correct sprintCode", async () => {
        mockedGetSprintTitle.mockResolvedValueOnce("Sprint 2");
        await validateMessageRequest(
            mockDb as unknown as Kysely<Database>,
            "anotherUser",
            "WD-1.2"
        );
        expect(mockedGetSprintTitle).toHaveBeenCalledWith(mockDb, "WD-1.2");
    });
});
