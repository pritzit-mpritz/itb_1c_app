/**
 * @fileoverview Service layer for actor-related database operations.
 * @module src/services/actorService
 */

import { db } from "../db";
import { Knex } from "knex"; // Import Knex type for better type checking

// Define an interface for the Actor object (optional but recommended)
interface Actor {
    actor_id: number;
    first_name: string;
    last_name: string;
    last_update: string; // Consider using Date type if parsing
}

/**
 * Retrieves all actors from the database, optionally filtering by the beginning of their first name.
 * @async
 * @param {string} [firstNameFilter] - Optional filter string. Matches actors whose first_name starts with this string.
 * @returns {Promise<Actor[]>} A promise that resolves to an array of actor objects.
 * @throws {Error} Throws an error if the database query fails.
 */
export async function getAllActors(firstNameFilter?: string): Promise<Actor[]> {
    const connection: Knex = db();
    let query = connection.select("*").from("actor");

    if (firstNameFilter) {
        // Use binding to prevent SQL injection, even if filtering seems simple
        query = query.where("first_name", "like", `${firstNameFilter}%`);
    }

    const actors: Actor[] = await query;
    console.log(`Selected ${actors.length} actors ${firstNameFilter ? `starting with "${firstNameFilter}"` : ''}`);
    return actors;
}

/**
 * Retrieves a single actor by their unique ID.
 * @async
 * @param {number} id - The unique identifier of the actor.
 * @returns {Promise<Actor | undefined>} A promise that resolves to the actor object if found, otherwise undefined.
 * @throws {Error} Throws an error if the database query fails.
 */
export async function getActorById(id: number): Promise<Actor | undefined> {
    if (isNaN(id) || id <= 0) {
        console.warn(`getActorById called with invalid ID: ${id}`);
        return undefined; // Return early for invalid IDs
    }
    const connection: Knex = db();
    const actor: Actor | undefined = await connection
        .select("*")
        .from("actor")
        .where("actor_id", id)
        .first(); // .first() returns the first row or undefined

    if (actor) {
        console.log("Selected actor: ", actor);
    } else {
        console.log(`Actor with ID ${id} not found.`);
    }
    return actor;
}

/**
 * Adds an association between an actor and a film in the film_actor table.
 * @async
 * @param {number} actorId - The ID of the actor.
 * @param {number} filmId - The ID of the film.
 * @returns {Promise<number[]>} A promise that resolves to an array containing the insert ID (or affected rows info depending on DB/driver).
 * @throws {Error} Throws an error if the database insert operation fails (e.g., foreign key constraint violation, duplicate entry).
 */
export async function addActorToFilm(actorId: number, filmId: number): Promise<number[]> {
    if (isNaN(actorId) || actorId <= 0 || isNaN(filmId) || filmId <= 0) {
        throw new Error(`Invalid actorId (${actorId}) or filmId (${filmId}) provided.`);
    }
    const connection: Knex = db();
    const insertData = {
        actor_id: actorId,
        film_id: filmId
        // last_update is typically handled by the database in Sakila
    };
    // Knex insert returns an array of inserted ids (or other info)
    const insertResult = await connection("film_actor").insert(insertData);

    console.log(`Inserted actor_id ${actorId} to film_id ${filmId}: Result: ${JSON.stringify(insertResult)}`);
    // Return the result, usually [insertId] for mysql
    return insertResult;
}