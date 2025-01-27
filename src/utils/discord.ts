import { Client, GatewayIntentBits, TextChannel  } from "discord.js";
import { config } from "dotenv";

config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(process.env.DISCORD_BOT_TOKEN);
client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

export const sendMessageToDiscord = async (
    channelId: string,
    message: string
) => {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel instanceof TextChannel) {
            await channel.send(message);
        } else {
            throw new Error("Channel not found or is not text-based.");
        }
    } catch (error) {
        console.error("Error in sendMessageToDiscord:", error);
        throw new Error("Failed to send message to Discord");
    }
};
