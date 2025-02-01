import { createSprintsRouter } from "./controller";
import { describe, it, vi, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { mockDb, mockQueryBuilder } from "../../mocks/db";

describe("Sprints API", () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/sprints", createSprintsRouter({ db: mockDb }));
    });

    it("should return list of sprints", async () => {
        const mockSprints = [
            { "code": "WD-5.1", title: "5 Sprint" },
            { "code": "WD-6.1", title: "6 Sprint" },
        ];

        // Настраиваем execute для возврата тестовых данных
        mockQueryBuilder.execute.mockResolvedValue(mockSprints);

        const response = await request(app).get("/sprints");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSprints);
    });

    it("should return 500 if an error occurs while fetching sprints", async () => {
        mockQueryBuilder.execute.mockRejectedValue(new Error("Database error"));

        const response = await request(app).get("/sprints");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to fetch sprints" });
    });

    it("should create a sprint", async () => {
        const newSprint = { code: "WD-7.1", title: "7 Sprint" };
        // Настраиваем мок для insertInto
        mockDb.insertInto = vi.fn().mockReturnValue(mockQueryBuilder);
        // Настраиваем мок для execute
        mockQueryBuilder.execute.mockResolvedValueOnce([1]); // Возвращаем успешный результат
        const response = await request(app).post("/sprints").send(newSprint);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Sprint created successfully",
        });
    });

    it("should return 409 if sprint code already exists", async () => {
        const duplicateSprint = { code: "WD-5.1", title: "Duplicate Sprint" };

        mockDb.insertInto = vi.fn().mockImplementation(() => {
            throw new Error("UNIQUE constraint failed");
        });

        const response = await request(app)
            .post("/sprints")
            .send(duplicateSprint);

        expect(response.status).toBe(409);
        expect(response.body).toEqual({ error: "Sprint code already exists" });
    });

    it("should update a sprint", async () => {
        const updatedSprint = { title: "Updated Sprint Title" };

        mockDb.updateTable = vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    execute: vi.fn().mockResolvedValue([1]), // Мокаем успешное обновление
                }),
            }),
        });

        const response = await request(app)
            .patch("/sprints/WD-5.1")
            .send(updatedSprint);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Sprint updated successfully",
        });
    });

    it("should return 404 if sprint to update is not found", async () => {
        mockDb.updateTable = vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    execute: vi.fn().mockResolvedValue([]), // Пустой результат означает, что запись не найдена
                }),
            }),
        });

        const response = await request(app)
            .patch("/sprints/WD-999")
            .send({ title: "Non-existent Sprint" });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Sprint not found" });
    });

    it("should delete a sprint", async () => {
        mockDb.deleteFrom = vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
                execute: vi.fn().mockResolvedValue([1]), // Успешное удаление
            }),
        });

        const response = await request(app).delete("/sprints/WD-5.1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Sprint deleted successfully",
        });
    });

    it("should return 404 if sprint to delete is not found", async () => {
        mockDb.deleteFrom = vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
                execute: vi.fn().mockResolvedValue([]), // Пустой массив — запись не найдена
            }),
        });

        const response = await request(app).delete("/sprints/WD-999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Sprint not found" });
    });

    it("should return 500 if an error occurs while deleting a sprint", async () => {
        mockDb.deleteFrom = vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
                execute: vi.fn().mockRejectedValue(new Error("Database error")),
            }),
        });

        const response = await request(app).delete("/sprints/WD-5.1");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to delete sprint" });
    });
});
