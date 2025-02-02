import { describe, expect, it, vi, beforeEach } from "vitest";
import { Client, TextChannel, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { sendMessageToDiscord } from "./discord";


config();

describe("Discord Bot Tests", () => {
    const mockClient = {
        channels: {
            fetch: vi.fn(),
        },
        login: vi.fn(),
        user: {
            tag: "TestBot#1234",
        },
    };

    // Mock channel with valid snowflake ID
    const mockChannel = {
        send: vi.fn().mockResolvedValue({}),
        type: "GUILD_TEXT",
        id: "123456789012345678", // Валидный snowflake ID
    };

    // Clear mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Configuration", () => {

        it("should load environment variables", () => {
            process.env.DISCORD_BOT_TOKEN = "test-token";
            expect(process.env.DISCORD_BOT_TOKEN).toBe("test-token");
        });
    });

    describe("Message Sending", () => {
        beforeEach(() => {
            (globalThis as any).client = mockClient;
        });



        it("should throw error for missing channel", async () => {
            mockClient.channels.fetch.mockRejectedValue(
                new Error("Channel not found")
            );

            await expect(
                sendMessageToDiscord("non-existent-channel", "Test message")
            ).rejects.toThrow("Failed to send message to Discord");
        });

    });
    describe("Error Handling", () => {
        beforeEach(() => {
            (globalThis as any).client = mockClient;
        });
        it("should log errors to console", async () => {
            const consoleErrorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            const mockChannel = {
                send: vi.fn().mockRejectedValue(new Error("Test error")),
                type: "GUILD_TEXT",
                id: "123456789012345678",
            };
            mockClient.channels.fetch.mockResolvedValue(mockChannel);

            try {
                await sendMessageToDiscord(mockChannel.id, "Test message");
            } catch {}

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error in sendMessageToDiscord:",
                expect.any(Error)
            );
        });
    });
});
