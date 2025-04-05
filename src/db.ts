// src/db.ts
import knex, {Knex} from 'knex';
import dotenv from "dotenv";

dotenv.config();

// Initialize knex connection
let dbConnection: Knex | undefined = undefined;

export const db = () : Knex => {
    if (!dbConnection) {
        // Verwende Defaults, falls Umgebungsvariablen fehlen, aber gib Warnungen aus
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPortStr = process.env.DB_PORT || '3306';
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD;
        const dbName = process.env.DB_NAME;

        if (!dbUser || !dbName) {
            console.warn("WARN: DB_USER or DB_NAME environment variable is not set.");
            // Entscheide, ob hier ein Fehler geworfen werden soll oder nicht
            // throw new Error("DB_USER and DB_NAME environment variables are required!");
        }

        const dbPort = parseInt(dbPortStr, 10);
        if (isNaN(dbPort)) {
            console.error(`ERROR: Invalid DB_PORT environment variable: ${dbPortStr}. Using default 3306.`);
            // throw new Error("Invalid DB_PORT environment variable!"); // Oder Fallback
        }

        console.log(`Initializing database connection to ${dbHost}:${dbPort || 3306}...`);

        dbConnection = knex({
            client: 'mysql2',
            connection: {
                host: dbHost,
                port: dbPort || 3306, // Fallback falls NaN
                user: dbUser,
                password: dbPassword,
                database: dbName,
                charset: 'utf8mb4' // Empfohlen
            },
            pool: { min: 0, max: 7 } // Minimaler Pool
        });
    }
    return dbConnection;
}; // Schließende Klammer für die Funktion