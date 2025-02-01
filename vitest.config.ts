import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        coverage: {
            provider: "v8",
            all: true,
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts"],
            reportsDirectory: "./coverage",
        },
        //setupFiles: ["./test/setup.ts"],
    },
});
