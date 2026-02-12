import path from "path";
import express from "express";
import knexInstance from "./database.js";

const app = express();
const port = 3000;
//to access the our html css and js folder in the folder
app.use(express.static(path.join(process.cwd(), "../")));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
//endpoint to get cards from database
app.get("/cards", async (req, res) => {
    const cards = await knexInstance.select("*").from("cards");
    res.json(cards);
});
//endpoint to get front from database
app.get("/card-front", async (req, res) => {
    const cardFront = await knexInstance.raw("select * from frontcard");
    res.json(cardFront);
});
//endpoint to add a score to database
app.post("/scores", async (req, res) => {
    try {
        const { playerName, difficulty, moves, time } = req.body;

        await knexInstance("scores").insert({
            playerName,
            difficulty,
            moves,
            time,
        });

        res.status(201).json({ message: "Score saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save score" });
    }
});

//endpoint to get score from database
app.get("/scores", async (req, res) => {
    const difficulty = req.query.difficulty;
    try {
        const scores = await knexInstance("scores")
            .where("difficulty", difficulty)
            .orderBy("time", "asc")
            .orderBy("moves", "asc")
            .limit(5);

        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

