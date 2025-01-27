import { Kysely } from "kysely";
import { Database } from "../types/database";
export interface MessageRouterDependencies {
    getRandomGif: () => Promise<string>;
    getRandomTemplate: (db: Kysely<Database>) => Promise<string>;
    sendMessageToDiscord: (channelId: string, message: string) => Promise<void>;
    saveMessage: (data: {
        username: string;
        sprintCode: number;
        message: string;
        gifUrl: string;
    }) => Promise<void>;
    validateMessageRequest: (
        db: Kysely<Database>,
        username: string,
        sprintCode: number
    ) => Promise<string>;
    discordChannelId: string | undefined;
    db: Kysely<Database>;
}
