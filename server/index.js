import path from "path";
import express from "express";
import knex from "./database.js";

const app = express();
const port = 3000;

//for connect the backend with index.html file
app.use(express.static(path.join(process.cwd(), "../")));

app.use(express.json());

app.get("/cards", async (req, res) => {
    const cards = await knex.select("*").from("cards");
    res.json(cards);
});

app.listen(port, function () {
    console.log(`Ready on http://localhost:${port}`);
});
