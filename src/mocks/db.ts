import { Kysely } from "kysely";
import { Database } from "../types/database";
import { vi } from "vitest";

export const mockQueryBuilder = {
    selectAll: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    where: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    insertInto: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    executeTakeFirst: vi.fn().mockResolvedValue({}),
    returning: vi.fn().mockReturnThis(),
};

export const mockDb: Kysely<Database> = {
    selectFrom: vi.fn().mockReturnValue(mockQueryBuilder),
    insertInto: vi.fn().mockReturnValue(mockQueryBuilder),
    updateTable: vi.fn().mockReturnValue(mockQueryBuilder),
    deleteFrom: vi.fn().mockReturnValue(mockQueryBuilder),
    // Добавляем пустые заглушки для недостающих методов
    with: vi.fn().mockReturnThis(),
    transaction: vi.fn().mockImplementation((cb) => cb(mockDb)),
    introspection: vi.fn().mockReturnValue({ getTables: vi.fn() }),
} as unknown as Kysely<Database>;
