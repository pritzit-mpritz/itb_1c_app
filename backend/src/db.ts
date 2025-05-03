import knex, {Knex} from 'knex';
import dotenv from "dotenv";

dotenv.config()

// Initialize knex connection
let dbConnection: Knex | undefined = undefined;

export const db = () : Knex => {
    if (!dbConnection) {
        dbConnection = knex({
            client: 'mysql2',
            connection: {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT!),
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                charset: 'utf8_bin'
            },
        });
    }

    return dbConnection;
}