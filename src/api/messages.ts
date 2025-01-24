import { Router } from "express";
import { getRandomGif } from "../utils/giphy";
import { getRandomTemplate } from "../services/messageService";
import { sendMessageToDiscord } from "../utils/discord";
import { saveMessage } from "../models/saveMessage";
import { validateMessageRequest } from "../services/validationService";
import { config } from "dotenv";
config();

const discordChannelId = process.env.DISCORD_CHANNEL_ID;

export const messagesRouter = Router();

messagesRouter.post("/", async (req, res) => {
    const { username, sprintCode } = req.body;

    try {
        const sprintTitle = validateMessageRequest(username, sprintCode);
        const gifUrl = await getRandomGif();
        const template = await getRandomTemplate();
        const message =
            template
                .replace("{username}", username)
                .replace(
                    "{sprintCode}",
                    `Sprint ${sprintCode} ${sprintTitle}`
                ) + `\n${gifUrl}`;

        if (!discordChannelId) {
            throw new Error("DISCORD_CHANNEL_ID is not defined in .env");
        }
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
