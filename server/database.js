import knexLibrary from "knex";

const dbFile =
    "C:\\Users\\Lenovo\\Documents\\Foundation Project\\Flip-Game\\server\\cardDatabase.sqlite3";

const knexInstance = knexLibrary({
    client: "sqlite3",
    connection: {
        filename: dbFile,
    },
});

export default knexInstance;
