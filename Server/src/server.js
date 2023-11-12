import{ configDotenv } from "dotenv";
import connectDB from "./db/database.js";

configDotenv({
    path:"./.env"
})



connectDB();
