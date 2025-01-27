import { db } from "./src/db/db";



async function populateDatabase() {
    try {
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

        await db
            .insertInto("sprints")
            .values([
                {
                    code: "WD-3.1",
                    title: "Node.js and Relational Databases",
                },
                {
                    code: "WD-3.2",
                    title: "REST APIs & Test Driven Development",
                },
                {
                    code: "WD-1.1",
                    title: "First Steps Into Programming with Python",
                },
                {
                    code: "WD-1.2",
                    title: "Intermediate Programming with Python",
                },
                {
                    code: "WD-1.4",
                    title: "Computer Science Fundamentals",
                },
            ])
            .execute();

        console.log("Database populated successfully!");
    } catch (error) {
        console.error("Error populating the database:", error);
    }
}

populateDatabase();
