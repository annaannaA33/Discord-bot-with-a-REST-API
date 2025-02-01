import { createTemplatesRouter } from "./controller";
import { describe, it, vi, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { mockDb, mockQueryBuilder } from "../../mocks/db";
import { Database, Template } from "../../types/database";

describe("Templates API", () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/templates", createTemplatesRouter({ db: mockDb }));
    });

    it("should create a template", async () => {
        const newTemplate = { text: "Test template" };

        // Настраиваем мок для insertInto
        mockDb.insertInto = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.values = vi.fn().mockReturnThis();
        mockQueryBuilder.returning = vi.fn().mockReturnThis();
        mockQueryBuilder.execute = vi
            .fn()
            .mockResolvedValue([{ id: 1, text: "Test template" }]);

        const response = await request(app)
            .post("/templates")
            .send(newTemplate);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 1,
            text: "Test template",
        });
    });

    it("should return 400 if template text is missing", async () => {
        const response = await request(app).post("/templates").send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Template text is required",
        });
    });

    it("should return list of templates", async () => {
        const mockTemplates = [
            { id: 1, text: "Template 1" },
            { id: 2, text: "Template 2" },
        ];

        mockDb.selectFrom = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.selectAll = vi.fn().mockReturnThis();
        mockQueryBuilder.execute = vi.fn().mockResolvedValue(mockTemplates);

        const response = await request(app).get("/templates");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockTemplates);
    });

    it("should return 500 if error occurs while fetching templates", async () => {
        mockDb.selectFrom = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.selectAll = vi.fn().mockReturnThis();
        mockQueryBuilder.execute = vi
            .fn()
            .mockRejectedValue(new Error("Database error"));

        const response = await request(app).get("/templates");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Failed to fetch templates",
        });
    });

    it("should update a template", async () => {
        const updatedTemplate = { text: "Updated template" };

        mockDb.updateTable = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.set = vi.fn().mockReturnThis();
        mockQueryBuilder.where = vi.fn().mockReturnThis();
        mockQueryBuilder.returning = vi.fn().mockReturnThis();
        mockQueryBuilder.executeTakeFirst = vi.fn().mockResolvedValue({
            id: 1,
            text: "Updated template",
        });

        const response = await request(app)
            .patch("/templates/1")
            .send(updatedTemplate);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            text: "Updated template",
        });
    });

    it("should return 404 if template to update is not found", async () => {
        mockDb.updateTable = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.set = vi.fn().mockReturnThis();
        mockQueryBuilder.where = vi.fn().mockReturnThis();
        mockQueryBuilder.returning = vi.fn().mockReturnThis();
        mockQueryBuilder.executeTakeFirst = vi
            .fn()
            .mockResolvedValue(undefined);

        const response = await request(app)
            .patch("/templates/999")
            .send({ text: "Non-existent template" });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "Template not found",
        });
    });

    it("should delete a template", async () => {
        mockDb.deleteFrom = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.where = vi.fn().mockReturnThis();
        mockQueryBuilder.executeTakeFirst = vi.fn().mockResolvedValue({});

        const response = await request(app).delete("/templates/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Template deleted successfully",
        });
    });

    it("should return 404 if template to delete is not found", async () => {
        mockDb.deleteFrom = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.where = vi.fn().mockReturnThis();
        mockQueryBuilder.executeTakeFirst = vi.fn().mockResolvedValue(null);

        const response = await request(app).delete("/templates/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "Template not found",
        });
    });

    it("should return 500 if error occurs while deleting template", async () => {
        mockDb.deleteFrom = vi.fn().mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.where = vi.fn().mockReturnThis();
        mockQueryBuilder.executeTakeFirst = vi
            .fn()
            .mockRejectedValue(new Error("Database error"));

        const response = await request(app).delete("/templates/1");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Failed to delete template",
        });
    });
});
