import express from "express";
import { config } from "dotenv";
import { createMessagesRouter } from "./api/messages";
import { createTemplatesRouter } from "./modules/templates";
import { getRandomGif } from "./utils/giphy";
import { getRandomTemplate } from "./services/messageService";
import { sendMessageToDiscord } from "./utils/discord";
import { saveMessage } from "./models/saveMessage";
import { validateMessageRequest } from "./services/validationService";
import { db } from "./db/db";
import { createSprintsRouter } from "./modules/sprints/controller"
config();

const app = express();
app.use(express.json());

const discordChannelId = process.env.DISCORD_CHANNEL_ID;

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
