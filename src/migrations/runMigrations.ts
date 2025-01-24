import { db } from "../db/db";
import { up as upMessages } from "./01_create_messages_table";
import { up as upTemplates } from "./02_create_templates_table";
import { up as upSprints } from "./03_create_sprints_table";

async function runMigrations() {
    await upMessages(db);
    await upTemplates(db);
    await upSprints(db);
    console.log("Migrations completed!");
}

runMigrations().catch((err) => {
    console.error("Error applying migrations:", err);
    process.exit(1);
});
