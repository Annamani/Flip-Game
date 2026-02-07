import path from "path";
import express from "express";
import knexInstance from "./database.js";

const app = express();
const port = 3000;
//to access the our html css and js folder in the folder
app.use(express.static(path.join(process.cwd())));

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
//endpoint to get cards from database
app.get("/cards", async (req, res) => {
    const cards = await knexInstance.select("*").from("cards");
    res.json(cards);
});
//regex is used here to match any url to run our index.html file
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(process.cwd(), "", "index.html"));
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});