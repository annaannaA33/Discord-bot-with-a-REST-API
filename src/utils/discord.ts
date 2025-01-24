import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config();
// Инициализация клиента Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
// Логинимся в Discord бота
client.login(process.env.DISCORD_BOT_TOKEN);

// Функция для отправки сообщения в Discord
export const sendMessageToDiscord = async (
    channelId: string,
    message: string
) => {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
            await channel.send(message);
        } else {
            throw new Error("Channel not found or is not text-based.");
        }
    } catch (error) {
        console.error("Error in sendMessageToDiscord:", error);
        throw new Error("Failed to send message to Discord");
    }
};
