import { Kysely } from "kysely";
import { Database } from "../types/database";


export interface TemplatesRouterDependencies {
    db: Kysely<Database>;
}
