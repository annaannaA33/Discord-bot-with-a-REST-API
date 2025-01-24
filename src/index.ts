import express from "express";
import { config } from "dotenv";
import { messagesRouter } from "./api/messages";

config(); // Подключаем .env

const app = express();
app.use(express.json());

// Роуты
app.use("/messages", messagesRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
