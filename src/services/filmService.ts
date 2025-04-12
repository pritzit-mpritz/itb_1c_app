/**
 * @file filmService.ts
 * @description Enthält Service-Funktionen für den Zugriff auf Filmdaten in der Datenbank.
 * Die Funktionen unterstützen das Abrufen von Filmen, das Abrufen eines einzelnen Films
 * und das Erstellen der Verknüpfung zwischen Film und Kategorie.
 */

import {db} from "../db";

/**
 * Holt alle Filme aus der Datenbank. Optional kann ein Titel-Filter übergeben werden.
 *
 * @param {string} [titleFilter] - Optionaler Filter für den Filmtitel.
 * @returns {Promise<any[]>} Eine Liste von Filmen.
 *
 * @example
 * const films = await getAllFilms("The");
 */

export async function getAllFilms(titleFilter?: string) {
    const connection = db();

    const films = await connection
        .select("*")
        .from("film")
        .whereLike("title", `${titleFilter}%`);

    console.log("Selected films: ", films);

    return films;
}

/**
 * Holt einen einzelnen Film anhand seiner ID.
 *
 * @param {number} id - Die ID des Films.
 * @returns {Promise<any>} Der Film als Objekt oder `undefined`, wenn nicht gefunden.
 *
 * @example
 * const film = await getFilmById(1);
 */


export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection.select("*")
        .from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
}

/**
 * Erstellt einen neuen Film in der Datenbank.
 *
 * @param {any} filmData - Ein Objekt, das die Daten des neuen Films enthält.
 * @returns {Promise<number>} - Die ID des neu erstellten Films.
 *
 * @example
 * const newFilmId = await createFilm({
 *   title: "The Matrix",
 *   description: "A thrilling sci-fi movie.",
 *   release_year: 1999,
 *   language_id: 1,
 *   rental_duration: 3,
 *   rental_rate: 4.99,
 *   length: 120,
 *   replacement_cost: 19.99,
 *   rating: "PG",
 *   special_features: "Commentaries,Deleted Scenes,Behind the Scenes"
 * });
 */

export async function createFilm(filmData: any): Promise<number> {
    const connection = db();
    const result = await connection("film")
        .insert(filmData);
    console.log("Created film with result:", result);
    return result[0];
}


/**
 * Löscht einen Film anhand der Film-ID.
 * @param {number} id - Die ID des Films.
 * @returns {Promise<number>} Die Anzahl der gelöschten Datensätze.
 */
export async function deleteFilm(id: number): Promise<number> {
    const connection = db();
    return connection("film")
        .where("film_id", id)
        .delete();
}

/**
 * Aktualisiert einen Film in der Datenbank anhand der Film-ID.
 *
 * @param {number} id - Die ID des Films, der aktualisiert werden soll.
 * @param {any} data - Ein Objekt mit den neuen Feldern des Films.
 * @returns {Promise<number>} - Die Anzahl der aktualisierten Zeilen (in der Regel 1, wenn der Film gefunden wurde).
 *
 * @example
 * const updatedRows = await updateFilm(1, {
 *   title: "The Matrix Reloaded",
 *   description: "A thrilling sequel.",
 *   release_year: 2003,
 *   language_id: 1,
 *   original_language_id: null,
 *   rental_duration: 3,
 *   rental_rate: 4.99,
 *   length: 138,
 *   replacement_cost: 19.99,
 *   rating: "PG-13",
 *   special_features: "Trailers,Deleted Scenes"
 * });
 */
export async function updateFilm(id: string, data: any): Promise<number> {
    const connection = db();

    // Prüfen, ob der Film existiert
    const film = await connection("film")
        .select("*")
        .where("film_id", id)
        .first();

    if (!film) {
        throw new Error("Film nicht gefunden");
    }

    // Film aktualisieren
    const updatedCount = await connection("film")
        .update({
            title: data.title,
            description: data.description,
            release_year: data.release_year,
            language_id: data.language_id,
            original_language_id: data.original_language_id,
            rental_duration: data.rental_duration,
            rental_rate: data.rental_rate,
            length: data.length,
            replacement_cost: data.replacement_cost,
            rating: data.rating,
            special_features: data.special_features
        })
        .where("film_id", id);

    return updatedCount;
}

/**
 * Erstellt eine Verknüpfung zwischen einem Film und einer Kategorie in der Zwischentabelle.
 *
 * @param {number} filmId - Die ID des Films.
 * @param {number} categoryId - Die ID der Kategorie.
 * @returns {Promise<number[]>} Das Ergebnis der Insert-Operation.
 *
 * @example
 * const result = await addFilmToCategory(1, 2);
 */

export async function addFilmToCategory(filmId: number, categoryId: number) {
    const connection = db();
    const insertOperation = await connection("film_category")
        .insert({
            film_id: filmId,
            category_id: categoryId
        });

    console.log("Inserted film to category: ", insertOperation);

    return insertOperation;
}

/**
 * Entfernt die Verknüpfung zwischen einem Film und einer Kategorie.
 *
 * @param {number} filmId - Die ID des Films.
 * @param {number} categoryId - Die ID der Kategorie.
 * @returns {Promise<number>} - Anzahl der gelöschten Zeilen (0 = nichts gefunden, 1 = erfolgreich entfernt).
 */
export async function deleteFilmCategory(filmId: number, categoryId: number): Promise<number> {
    const connection = db();

    const deletedCount = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .delete();

    return deletedCount;
}