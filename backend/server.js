import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("EvaluateAI API");
});

async function connectDB() {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected to MongoDB");
}

connectDB();

const port = process.env.PORT || 8080;

app.listen(8080, () => {
    console.log(`Server at http://localhost:${port}`);
});