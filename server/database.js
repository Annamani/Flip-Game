import knex from "knex";

const knexInstance = knex({
    client: "sqlite3",
    connection: {
        filename: "C:\\Users\\annam\\Documents\\Foundation Project\\Flip-Game\\server\\cardDatabase.sqlite3",
    },
    useNullAsDefault: true, // Omit warning in console
});
export default knexInstance;
