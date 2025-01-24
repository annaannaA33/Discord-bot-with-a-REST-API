import axios from "axios";
import { config } from "dotenv"

config();
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export const getRandomGif = async (): Promise<string> => {
    try {
        const response = await axios.get(
            `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=celebration&rating=g`
        );
        // Проверяем, есть ли URL в ответе
        //const gifUrl = response.data.data?.[0]?.url;
        const gifUrl = response.data.data?.url;

        if (!gifUrl) {
            console.warn("No GIF URL found in Giphy API response");
            return "";
        }

        return gifUrl;
    } catch (error) {
        console.error(
            "Error fetching GIF:",
            error.response?.data || error.message
        );
        throw new Error("Unable to fetch GIF");
    }
};
