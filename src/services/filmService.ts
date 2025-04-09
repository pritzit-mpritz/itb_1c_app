// src/services/filmService.ts
import { db } from "../db";

const TABLE_NAME = 'film';

/**
 * Holt alle Filme, optional gefiltert nach Titelanfang.
 * @param {string} [titleFilter] Optionaler Filter für den Titel (Beginn des Titels).
 * @returns {Promise<any[]>} Array aller passenden Film-Objekte.
 * @throws {Error} Datenbankfehler.
 */
export async function getAllFilms(titleFilter?: string): Promise<any[]> {
    const connection = db();
    let query = connection.select("*").from(TABLE_NAME);
    if (titleFilter) {
        query = query.where("title", "like", `${titleFilter}%`);
    }
    return query; // Gibt das Promise des Query Builders zurück
}

/**
 * Holt einen Film anhand seiner ID.
 * @param {number} filmId Die ID des Films.
 * @returns {Promise<any | undefined>} Das Film-Objekt oder undefined, wenn nicht gefunden.
 * @throws {Error} Datenbankfehler.
 */
export async function getFilmById(filmId: number): Promise<any | undefined> {
    const connection = db();
    return connection(TABLE_NAME).where("film_id", filmId).first();
}