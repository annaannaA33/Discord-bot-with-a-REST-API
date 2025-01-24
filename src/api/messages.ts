import { Router } from "express";
import { getRandomGif } from "../utils/giphy";
import { getRandomTemplate } from "../services/messageService";
import { db } from "../models/db";
import { sendMessageToDiscord } from "../utils/discord";
import { config } from "dotenv";
import { getSprintTitle } from "../services/sprintService";

config();

const discordChannelId = process.env.DISCORD_CHANNEL_ID;

export const messagesRouter = Router();

messagesRouter.post("/", async (req, res) => {
    const { username, sprintCode } = req.body;

    // Проверка на обязательные поля
    if (!username || isNaN(Number(sprintCode))) {
        return res
            .status(400)
            .json({ error: "Username and valid sprintCode are required" });
    }

    try {
        // Получаем случайный GIF
        const gifUrl = await getRandomGif();

        // Получаем случайный шаблон поздравления
        const template = await getRandomTemplate();
        //const sprintCode = Number(req.body.sprintCode);
        const sprintTitle = await getSprintTitle(Number(sprintCode));
        if (!sprintTitle) {
            return res.status(404).json({ error: "Sprint not found" });
        }
        // Формируем сообщение
        const message =
            template
                .replace("{username}", username)
                .replace("{sprintCode}", `Sprint ${sprintCode} ${sprintTitle}`) +
            `\n${gifUrl}`;

        // Отправляем сообщение в Discord
        if (!discordChannelId) {
            throw new Error("DISCORD_CHANNEL_ID is not defined in .env");
        }
        await sendMessageToDiscord(discordChannelId, message);

        // Записываем сообщение в базу данных
        await db
            .insertInto("messages")
            .values({
                username,
                sprintCode,
                message,
                gifUrl,
            })
            .execute();

        // Отправляем успешный ответ
        res.status(200).json({ message: "Congratulatory message sent!" });
        console.log(gifUrl);
    } catch (error) {
        console.error("Error sending congratulatory message:", error);
        res.status(500).json({
            error: "Failed to send congratulatory message",
        });
    }
});
