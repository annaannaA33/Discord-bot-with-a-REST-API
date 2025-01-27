import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSprintTitle } from "./sprintService";
import { Kysely } from "kysely";
import { Database } from "../types/database";

vi.mock("kysely", () => ({
    Kysely: vi.fn().mockImplementation(() => ({
        selectFrom: vi.fn(),
    })),
}));

const mockDb = {
    selectFrom: vi.fn(),
};

describe("getSprintTitle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the sprint title if sprint exists", async () => {
        const mockExecuteTakeFirst = vi
            .fn()
            .mockResolvedValueOnce({ title: "Sprint 1" });
        mockDb.selectFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    executeTakeFirst: mockExecuteTakeFirst,
                }),
            }),
        });

        const result = await getSprintTitle(
            mockDb as unknown as Kysely<Database>,
            "WD-1.1"
        );
        expect(result).toBe("Sprint 1");
        expect(mockDb.selectFrom).toHaveBeenCalledOnce();
        expect(mockExecuteTakeFirst).toHaveBeenCalledOnce();
    });

    it("should return null if sprint does not exist", async () => {
        const mockExecuteTakeFirst = vi.fn().mockResolvedValueOnce(null);
        mockDb.selectFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    executeTakeFirst: mockExecuteTakeFirst,
                }),
            }),
        });

        const result = await getSprintTitle(
            mockDb as unknown as Kysely<Database>,
            "WD-999"
        );
        expect(result).toBeNull();
        expect(mockDb.selectFrom).toHaveBeenCalledOnce();
        expect(mockExecuteTakeFirst).toHaveBeenCalledOnce();
    });

    it("should throw an error if the database query fails", async () => {
        const mockExecuteTakeFirst = vi
            .fn()
            .mockRejectedValueOnce(new Error("Database error"));
        mockDb.selectFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    executeTakeFirst: mockExecuteTakeFirst,
                }),
            }),
        });

        await expect(
            getSprintTitle(mockDb as unknown as Kysely<Database>, "WD-1.1")
        ).rejects.toThrow("Database error");
        expect(mockDb.selectFrom).toHaveBeenCalledOnce();
        expect(mockExecuteTakeFirst).toHaveBeenCalledOnce();
    });
});
