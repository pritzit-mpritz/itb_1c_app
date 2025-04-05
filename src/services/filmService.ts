// src/services/filmService.ts
import { db } from "../db";

const TABLE_NAME = 'film'; // Anpassen, falls nötig

/**
 * Gibt alle Filme zurück.
 */
export async function getAllFilms(): Promise<any[]> {
    const connection = db();
    try {
        return await connection(TABLE_NAME).select("*");
    } catch (error) {
        console.error(`Error fetching all films from ${TABLE_NAME}:`, error);
        throw error;
    }
}

/**
 * Gibt einen Film anhand seiner ID zurück.
 */
export async function getFilmById(filmId: number): Promise<any | undefined> {
    const connection = db();
    try {
        return await connection(TABLE_NAME).where("film_id", filmId).first();
    } catch (error) {
        console.error(`Error fetching film with ID ${filmId}:`, error);
        throw error;
    }
}

/**
 * Legt einen neuen Film an.
 * @param filmData Objekt mit den Filmdaten.
 */
export async function createFilm(filmData: object): Promise<any | undefined> {
    const connection = db();
    try {
        const [insertedId] = await connection(TABLE_NAME).insert(filmData);
        if (insertedId) {
            return getFilmById(insertedId);
        }
        console.error("Film creation did not return an ID.");
        return undefined;
    } catch (error: any) {
        console.error(`Error creating film:`, error);
        throw error;
    }
}


/**
 * Aktualisiert einen vorhandenen Film.
 * @param {number} filmId - Die ID des Films, der aktualisiert werden soll.
 * @param {object} filmData - Objekt mit den zu aktualisierenden Feldern.
 * @returns {Promise<any | undefined>} Gibt das aktualisierte Filmobjekt zurück oder `undefined`, wenn der Film nicht gefunden wurde.
 */
export async function updateFilm(filmId: number, filmData: object): Promise<any | undefined> {
    const connection = db();
    try {
        const affectedRows = await connection(TABLE_NAME)
            .where("film_id", filmId)
            .update(filmData);
        if (affectedRows > 0) {
            return getFilmById(filmId);
        } else {
            return undefined; // Nicht gefunden
        }
    } catch (error) {
        console.error(`Error updating film ${filmId}:`, error);
        throw error;
    }
}

/**
 * Löscht einen Film.
 */
export async function deleteFilm(filmId: number): Promise<number> {
    const connection = db();
    try {
        return await connection(TABLE_NAME).where("film_id", filmId).del();
    } catch (error) {
        console.error(`Error deleting film ${filmId}:`, error);
        throw error;
    }
}