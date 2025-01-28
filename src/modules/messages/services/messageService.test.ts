import { describe, it, expect, vi } from "vitest";
import { getRandomTemplate } from "./messageService";
import { Kysely } from "kysely";
import { Database } from "../../../types/database";
import { Template } from "../../../types/database";

const mockDb = {
    selectFrom: vi.fn(),
};

describe("getRandomTemplate", () => {
    it("should return a random template if templates are found", async () => {
        const mockTemplates: Template[] = [{ text: "Template 1" }];
        mockDb.selectFrom.mockReturnValue({
            selectAll: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                    limit: vi.fn().mockReturnValue({
                        execute: vi.fn().mockResolvedValue(mockTemplates),
                    }),
                }),
            }),
        });

        const result = await getRandomTemplate(
            mockDb as unknown as Kysely<Database>
        );

        expect(result).toBe("Template 1");
        expect(mockDb.selectFrom).toHaveBeenCalledOnce();
    });

    it("should throw an error if no templates are found", async () => {
        const selectFromMock = vi.fn().mockReturnValue({
            selectAll: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                    limit: vi.fn().mockReturnValue({
                        execute: vi.fn().mockResolvedValue([]), // Мокаем пустой массив
                    }),
                }),
            }),
        });

        mockDb.selectFrom = selectFromMock;

        await expect(
            getRandomTemplate(mockDb as unknown as Kysely<Database>)
        ).rejects.toThrow("No templates found");

        // Проверяем, что selectFrom был вызван только один раз
        expect(selectFromMock).toHaveBeenCalledTimes(1);
    });
    it("should call the correct db methods", async () => {
        const mockTemplates: Template[] = [{ text: "Template 2" }];
        mockDb.selectFrom.mockReturnValue({
            selectAll: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                    limit: vi.fn().mockReturnValue({
                        execute: vi.fn().mockResolvedValue(mockTemplates),
                    }),
                }),
            }),
        });

        await getRandomTemplate(mockDb as unknown as Kysely<Database>);

        // Checking that db methods are called with the correct arguments

        expect(mockDb.selectFrom).toHaveBeenCalledWith("templates");
    });
});
