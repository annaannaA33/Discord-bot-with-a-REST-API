import { Router } from "express";
import { MessageRouterDependencies } from "../types/messageRouter";
import { db } from "../db/db";


const router = Router();

router.get("/", async (req, res) => {
    try {
        
        const messages = await db
            .selectFrom("messages")
            .select([
                "id",
                "username",
                "sprintCode",
                "message",
                "gifUrl",
                "createdAt",
            ])
            .execute();

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
