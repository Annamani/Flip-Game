import path from "path";
import knex from "knex";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbFile = path.join(__dirname, "cardDatabase.sqlite3");

const knexInstance = knex({
    client: "sqlite3",
    connection: {
        filename: dbFile,
    },
    useNullAsDefault: true, // Omit warning in console
});
export default knexInstance;
