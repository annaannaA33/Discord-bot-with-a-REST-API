import { Database, Sprint } from "../../types/database";
import { Router } from "express";

import { z } from "zod";
import { TemplatesRouterDependencies } from "../../types/createTemplatesRouter";

export function createSprintsRouter({
    db,
}: TemplatesRouterDependencies): Router {
    const router = Router();
    router.post("/", async (req, res) => {
        const { code, title } = req.body;
        try {
            await db.insertInto("sprints").values({ code, title }).execute();
            res.status(201).json({ message: "Sprint created successfully" });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("UNIQUE constraint failed")
            ) {
                res.status(409).json({ error: "Sprint code already exists" });
                return;
            }

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

    router.patch("/:code", async (req, res) => {
        const code = req.params.code;
        const { title } = req.body;

        try {
            const result = await db
                .updateTable("sprints")
                .set({ title })
                .where("code", "=", code)
                .execute();

            if (result.length === 0) {
                res.status(404).json({ error: "Sprint not found" });
                return;
            }

            res.status(200).json({ message: "Sprint updated successfully" });
        } catch (error) {
            console.error("Error updating sprint:", error);
            res.status(500).json({ error: "Failed to update sprint" });
        }
    });

    router.delete("/:code", async (req, res) => {
        const { code } = req.params;
        try {
            const result = await db
                .deleteFrom("sprints")
                .where("code", "=", code)
                .execute();

            if (result.length === 0) {
                res.status(404).json({ error: "Sprint not found" });
                return;
            }

            res.status(200).json({ message: "Sprint deleted successfully" });
            return;
        } catch (error) {
            console.error("Error deleting sprint:", error);
             res.status(500).json({ error: "Failed to delete sprint" });
             return;
        }
    });
    return router;
}
