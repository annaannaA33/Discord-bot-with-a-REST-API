import axios from "axios";
import { config } from "dotenv";

config();

if (!process.env.GIPHY_API_KEY) {
    throw new Error("GIPHY_API_KEY is not defined in .env file.");
}
if (!process.env.FALLBACK_GIF_URL) {
    throw new Error("FALLBACK_GIF_URL is not defined in .env file.");
}

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const FALLBACK_GIF_URL = process.env.FALLBACK_GIF_URL;

export const getRandomGif = async (): Promise<string> => {
    try {
        const response = await axios.get(
            `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=celebration&rating=g`
        );
        const gifUrl = response.data.data?.url;

        if (!gifUrl) {
            console.warn("No GIF URL found in Giphy API response");
            return FALLBACK_GIF_URL;
        }

        return gifUrl;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching GIF:", error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
        console.warn("Using fallback GIF.");
        return FALLBACK_GIF_URL;
    }
};
