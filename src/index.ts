import { app } from "../src/app";
import { config } from "dotenv";
config();



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
