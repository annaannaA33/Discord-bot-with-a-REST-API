import { Router } from "express";
import { Kysely } from "kysely";
import { Database, Sprint } from "../../types/database";
import { z } from "zod";

const createSprintSchema = z.object({
    code: z.string().min(1, "Code is required"),
    title: z.string().min(1, "Title is required"),
});

const updateSprintSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
});

export function createSprintsRouter(db: Kysely<Database>): Router {
    const router = Router();

    router.post("/", async (req, res) => {
        const validation = createSprintSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { code, title } = validation.data;

        try {
            await db.insertInto("sprints").values({ code, title }).execute();
            res.status(201).json({ message: "Sprint created successfully" });
        } catch (error) {
            console.error("Error creating sprint:", error);
            res.status(500).json({ error: "Failed to create sprint" });
        }
    });

    router.get("/", async (_, res) => {
        try {
            const sprints = await db
                .selectFrom("sprints")
                .selectAll()
                .execute();
            res.status(200).json(sprints);
        } catch (error) {
            console.error("Error fetching sprints:", error);
            res.status(500).json({ error: "Failed to fetch sprints" });
        }
    });

    router.patch("/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid sprint ID" });
        }

        const validation = updateSprintSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { title } = validation.data;

        try {
            const result = await db
                .updateTable("sprints")
                .set({ title })
                .where("id", "=", id)
                .execute();

            if (result.numUpdatedRows === 0) {
                return res.status(404).json({ error: "Sprint not found" });
            }

            res.status(200).json({ message: "Sprint updated successfully" });
        } catch (error) {
            console.error("Error updating sprint:", error);
            res.status(500).json({ error: "Failed to update sprint" });
        }
    });

    // DELETE /sprints/:id - Удаление спринта
    router.delete("/:id", async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid sprint ID" });
        }

        try {
            const result = await db
                .deleteFrom("sprints")
                .where("id", "=", id)
                .execute();

            if (result.numDeletedRows === 0) {
                return res.status(404).json({ error: "Sprint not found" });
            }

            res.status(200).json({ message: "Sprint deleted successfully" });
        } catch (error) {
            console.error("Error deleting sprint:", error);
            res.status(500).json({ error: "Failed to delete sprint" });
        }
    });

    return router;
}