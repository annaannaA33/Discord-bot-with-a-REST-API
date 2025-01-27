import { Router } from "express";
import { Kysely } from "kysely";
import { Database } from "../types/database";

export function createTemplatesRouter(db: Kysely<Database>): Router {
    const router = Router();

    // Create a new template
    router.post("/", async (req, res) => {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Template text is required" });
        }

        try {
            const [insertedTemplate] = await db
                .insertInto("templates")
                .values({ text })
                .returning(["id", "text"])
                .execute();

            res.status(201).json(insertedTemplate);
        } catch (error) {
            console.error("Error creating template:", error);
            res.status(500).json({ error: "Failed to create template" });
        }
    });

    // Get all templates
    router.get("/", async (req, res) => {
        try {
            const templates = await db
                .selectFrom("templates")
                .selectAll()
                .execute();
            res.status(200).json(templates);
        } catch (error) {
            console.error("Error fetching templates:", error);
            res.status(500).json({ error: "Failed to fetch templates" });
        }
    });

    // Update a template
    router.patch("/:id", async (req, res) => {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Template text is required" });
        }

        try {
            const updatedTemplate = await db
                .updateTable("templates")
                .set({ text })
                .where("id", "=", Number(id))
                .returning(["id", "text"])
                .executeTakeFirst();

            if (!updatedTemplate) {
                return res.status(404).json({ error: "Template not found" });
            }

            res.status(200).json(updatedTemplate);
        } catch (error) {
            console.error("Error updating template:", error);
            res.status(500).json({ error: "Failed to update template" });
        }
    });

    // Delete a template
    router.delete("/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const deletedCount = await db
                .deleteFrom("templates")
                .where("id", "=", Number(id))
                .executeTakeFirst();

            if (!deletedCount) {
                return res.status(404).json({ error: "Template not found" });
            }

            res.status(200).json({ message: "Template deleted successfully" });
        } catch (error) {
            console.error("Error deleting template:", error);
            res.status(500).json({ error: "Failed to delete template" });
        }
    });

    return router;
}
