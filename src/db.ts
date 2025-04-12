/**
 * @fileoverview Knex.js database connection setup.
 * @module src/db
 * @description This file sets up and provides the Knex.js database connection instance.
 * It uses environment variables for configuration and implements a singleton pattern
 * to ensure only one connection pool is created.
 */

import knex, { Knex } from 'knex';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Singleton instance of the Knex connection
let dbConnection: Knex | undefined = undefined;

/**
 * Provides the Knex database connection instance (Singleton).
 * Initializes the connection pool on the first call using environment variables.
 * Logs configuration details and potential errors during setup.
 *
 * Required environment variables:
 * - DB_USER: Database username
 * - DB_NAME: Database name
 * Optional environment variables (with defaults):
 * - DB_HOST: Database host (default: 'localhost')
 * - DB_PORT: Database port (default: '3306')
 * - DB_PASSWORD: Database password (default: none)
 *
 * @function db
 * @returns {Knex} The initialized Knex database connection instance.
 * @throws {Error} If critical environment variables (DB_USER, DB_NAME) are missing.
 * @throws {Error} If the DB_PORT environment variable is not a valid number.
 * @throws {Error} If Knex fails to configure the connection pool.
 * @see {@link https://knexjs.org/} for Knex documentation.
 */
export const db = (): Knex => {
    // Initialize connection only if it doesn't exist yet
    if (!dbConnection) {
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPortStr = process.env.DB_PORT || '3306';
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD; // Can be undefined or an empty string
        const dbName = process.env.DB_NAME;

        // Validate required environment variables
        if (!dbUser || !dbName) {
            const errorMsg = "FATAL ERROR: DB_USER or DB_NAME missing in .env!";
            console.error(errorMsg);
            // Throw a more specific error for clarity
            throw new Error("Missing required environment variables: DB_USER and/or DB_NAME!");
        }

        // Validate Port
        const dbPort = parseInt(dbPortStr, 10);
        if (isNaN(dbPort)) {
            const errorMsg = `FATAL ERROR: Invalid DB_PORT: ${dbPortStr}`;
            console.error(errorMsg);
            throw new Error(`Invalid DB_PORT environment variable: ${dbPortStr}. Must be a number.`);
        }

        console.log(`Initializing DB connection to ${dbHost}:${dbPort} (User: ${dbUser}, DB: ${dbName})...`);
        try {
            // Configure Knex
            dbConnection = knex({
                client: 'mysql2', // Use the mysql2 driver
                connection: {
                    host: dbHost,
                    port: dbPort,
                    user: dbUser,
                    password: dbPassword,
                    database: dbName,
                    charset: 'utf8mb4' // Recommended charset for broad character support
                },
                pool: { // Connection pool configuration
                    min: 0, // Minimum number of connections
                    max: 7  // Maximum number of connections
                },
                debug: process.env.NODE_ENV === 'development' // Enable debug logging in development
            });
            console.log("DB connection pool successfully configured.");
        } catch (error) {
            // Catch errors during Knex configuration (e.g., invalid client)
            console.error("FATAL ERROR during DB configuration:", error);
            // Re-throw the error to stop application startup if configuration fails
            throw new Error(`Database configuration failed: ${error instanceof Error ? error.message : error}`);
        }
    }
    // Return the existing or newly created connection instance
    return dbConnection;
};