import { Router } from "express";
import { MessageRouterDependencies } from "../types/messageRouter";
export function createMessagesRouter({
    getRandomGif,
    getRandomTemplate,
    sendMessageToDiscord,
    saveMessage,
    validateMessageRequest,
    discordChannelId,
    db,
}: MessageRouterDependencies): Router {
    if (!discordChannelId) {
        throw new Error("DISCORD_CHANNEL_ID is not defined in .env");
    }

    const router = Router();

    router.post("/", async (req, res) => {
        const { username, sprintCode } = req.body;

        try {
            const sprintTitle = await validateMessageRequest(
                db,
                username,
                sprintCode
            );
            const gifUrl = await getRandomGif();
            const template = await getRandomTemplate(db);
            const message =
                template
                    .replace("{username}", username)
                    .replace(
                        "{sprintCode}",
                        `Sprint ${sprintCode} ${sprintTitle}`
                    ) + `\n${gifUrl}`;

            await sendMessageToDiscord(discordChannelId, message);
            await saveMessage({ username, sprintCode, message, gifUrl });

            res.status(200).json({ message: "Congratulatory message sent!" });
        } catch (error) {
            console.error("Error sending congratulatory message:", error);
            res.status(500).json({
                error: "Failed to send congratulatory message",
            });
        }
    });

    router.get("/", async (req, res) => {
        const { username, sprint } = req.query;

        try {
            let query = db
                .selectFrom("messages")
                .select([
                    "id",
                    "username",
                    "sprintCode",
                    "message",
                    "gifUrl",
                    "createdAt",
                ]);

            if (username) {
                query = query.where("username", "=", username as string);
            }

            if (sprint) {
                query = query.where("sprintCode", "=", sprint as string);
            }

            const messages = await query.execute();

            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: "Failed to fetch messages" });
        }
    });

    return router;
}
