// src/db.ts
import knex, {Knex} from 'knex';
import dotenv from "dotenv";

dotenv.config();

let dbConnection: Knex | undefined = undefined;

/**
 * Stellt die Knex DB-Verbindung bereit (Singleton).
 * @returns {Knex} Knex-Instanz.
 * @throws {Error} Bei fehlenden kritischen ENV-Variablen oder ungültigem Port.
 */
export const db = () : Knex => {
    if (!dbConnection) {
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPortStr = process.env.DB_PORT || '3306';
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD;
        const dbName = process.env.DB_NAME;

        if (!dbUser || !dbName) {
            console.error("FATAL ERROR: DB_USER or DB_NAME missing in .env!");
            throw new Error("DB_USER and DB_NAME environment variables are required!");
        }
        const dbPort = parseInt(dbPortStr, 10);
        if (isNaN(dbPort)) {
            console.error(`FATAL ERROR: Invalid DB_PORT: ${dbPortStr}`);
            throw new Error("Invalid DB_PORT environment variable!");
        }

        console.log(`Initializing DB connection to ${dbHost}:${dbPort}...`);
        try {
            dbConnection = knex({
                client: 'mysql2',
                connection: { host: dbHost, port: dbPort, user: dbUser, password: dbPassword, database: dbName, charset: 'utf8mb4' },
                pool: { min: 0, max: 7 }
            });
            console.log("DB connection configured.");
        } catch (error) {
            console.error("FATAL ERROR during DB configuration:", error);
            throw error;
        }
    }
    return dbConnection;
};