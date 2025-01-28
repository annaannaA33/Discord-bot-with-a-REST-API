import { config } from "dotenv";
import express from "express";
import { createMessagesRouter } from "./modules/messages/controller";
import { createTemplatesRouter } from "./modules/templates/controller";
import { createSprintsRouter } from "./modules/sprints/controller";
import { getRandomGif } from "./utils/giphy";
import { getRandomTemplate } from "./modules/messages/services/messageService";
import { sendMessageToDiscord } from "./utils/discord";
import { saveMessage } from "./modules/messages/services/saveMessage";
import { validateMessageRequest } from "./modules/messages/services/validationService";
import { db } from "./db/db";
config();

const discordChannelId = process.env.DISCORD_CHANNEL_ID;
const app = express();
app.use(express.json());

app.use(
    "/messages",
    createMessagesRouter({
        getRandomGif,
        getRandomTemplate,
        sendMessageToDiscord,
        saveMessage,
        validateMessageRequest,
        discordChannelId,
        db,
    })
);

app.use("/templates", createTemplatesRouter(db));
app.use("/sprints", createSprintsRouter(db));

export { app };
