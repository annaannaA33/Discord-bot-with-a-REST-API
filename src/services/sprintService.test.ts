import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "../db/db";
import { getSprintTitle } from "./sprintService";

// Мокаем базу данных
vi.mock("../db/db", () => ({
    db: {
        selectFrom: vi.fn(),
    },
}));

const mockDb = db as unknown as {
    selectFrom: vi.Mock;
};

describe("getSprintTitle", () => {
    // Сбрасываем все моки перед каждым тестом
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

        const result = await getSprintTitle(1);
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

        const result = await getSprintTitle(999);
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

        await expect(getSprintTitle(1)).rejects.toThrow("Database error");
        expect(mockDb.selectFrom).toHaveBeenCalledOnce();
        expect(mockExecuteTakeFirst).toHaveBeenCalledOnce();
    });
});
