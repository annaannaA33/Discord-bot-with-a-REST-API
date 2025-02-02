import { Kysely } from "kysely";
import { vi } from "vitest";
import { SelectQueryBuilder } from "kysely";
import { Database, Message, Template, Sprint } from "../types/database";

type BaseSelectQueryBuilder = SelectQueryBuilder<
    { [key: string]: Message | Template | Sprint },
    any,
    {}
>;

export const mockClient = {
    channels: {
        fetch: vi.fn(),
    },
    login: vi.fn(),
    user: {
        tag: "TestBot#1234",
    },
};

export const mockQueryBuilder = {
    selectAll: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
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
    with: vi.fn().mockReturnThis(),
    transaction: vi.fn().mockImplementation((cb) => cb(mockDb)),
    introspection: vi.fn().mockReturnValue({ getTables: vi.fn() }),
} as unknown as Kysely<Database>;

export const validationErrorQuery = {
    ...mockQueryBuilder,
    execute: vi.fn().mockResolvedValue(null),
    whereRef: vi.fn().mockReturnThis(),
    having: vi.fn().mockReturnThis(),
    havingRef: vi.fn().mockReturnThis(),
    distinctOn: vi.fn().mockReturnThis(),
} as unknown as BaseSelectQueryBuilder;

(globalThis as any).client = mockClient;
