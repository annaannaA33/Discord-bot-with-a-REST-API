/*import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

// Создаем подключение к базе данных с использованием better-sqlite3
export const db = new Kysely({
    dialect: new SqliteDialect({
        database: new Database(process.env.DATABASE_URL || "./database.sqlite"), // Используем better-sqlite3
    }),
});
*/
import { db } from "./src/models/db"; // Подключаем единое подключение к базе

// Функция для заполнения базы данных
async function populateDatabase() {
    try {
        // Заполняем таблицу templates с несколькими вариантами текста
        await db
            .insertInto("templates")
            .values([
                {
                    text: "Congratulations {username}💪 on completing {sprintCode}!",
                },
                {
                    text: "Well done {username}💪💪💪, you've finished {sprintCode}!",
                },
                {
                    text: "Awesome job, {username}💪! {sprintCode} is completed!",
                },
                {
                    text: "You did it! I knew you could. 🤗, {username}! You've completed {sprintCode}.",
                },
            ])
            .execute();

        // Заполняем таблицу sprints с несколькими спринтами
        await db
            .insertInto("sprints")
            .values([
                { code: "Sprint-1", title: "Node.js and Relational Databases" },
                {
                    code: "Sprint-2",
                    title: "REST APIs & Test Driven Development",
                },
                { code: "Sprint-3", title: "Advanced JavaScript & TypeScript" },
                {
                    code: "Sprint-4",
                    title: "Building Scalable Apps with Node.js",
                },
                { code: "Sprint-5", title: "GraphQL and Data Management" },
            ])
            .execute();

        console.log("Database populated successfully!");
    } catch (error) {
        console.error("Error populating the database:", error);
    }
}

// Вызываем функцию для заполнения данных
populateDatabase();
