import { configDotenv } from "dotenv";
import connectDB from "./db/database.js";
import app from "./app.js";

configDotenv({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection Failed !!", err);
  });
