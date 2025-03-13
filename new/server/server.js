import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/users.js";
import { appName } from "./utils/config.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

dotenv.config();
const port = 8000;

app.get("/", (req, res) => {
    res.send(appName);
});

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});