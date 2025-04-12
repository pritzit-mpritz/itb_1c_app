import {db} from "../db";

/**
 * Ruft alle Filme ab. Optional kann nach dem Filmtitel gefiltert werden.
 *
 * @param {string} [title] - optionaler Titel-Filter (beginnt mit dem gegebenen Titel)
 * @returns {Promise<any[]>} - Eine Liste aller Filme, gefiltert oder vollständig.
 * @throws {Error} - Bei Datenbankfehlern.
 */
export async function getAllFilms(title?: string) {
    const connection = db();

    if (title) {
        return connection
            .select("*")
            .from("film")
            .whereLike("title", `${title}%`);
    } else {
        return connection
        .select("*")
        .from("film");
    }
}

/**
 * Ruft einen Film anhand seiner ID ab.
 *
 * @param {number} id - Die ID des Films.
 * @returns {Promise<any>} - Das Filmobjekt oder undefined, wenn nicht gefunden.
 * @throws {Error} - Bei Datenbankfehlern.
 */
export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection
        .select("*")
        .from("film")
        .where("film_id", id)
        .first();

    return film;
}

/**
 * Fügt einen neuen Film in die Datenbank ein.
 *
 * @param {any} filmData - Die Filmdaten.
 * @returns {Promise<number>} - Die ID des neu eingefügten Films.
 * @throws {Error} - Bei Datenbankfehlern.
 */
export const postNewFilm = async (filmData: any): Promise<number> => {
    const connection = db();
    const insertOperation = await connection.insert(filmData).into("film");
    return insertOperation[0];
};

/**
 * Aktualisiert einen bestehenden Film mit neuen Daten.
 *
 * @param {number} id - Die ID des Films, der aktualisiert werden soll.
 * @param {object} updateData - Die neuen Filmdaten.
 * @param {string} updateData.title - Titel des Films.
 * @param {string} updateData.description - Beschreibung des Films.
 * @param {string} [updateData.release_year] - Erscheinungsjahr.
 * @param {number} [updateData.language_id] - Sprache.
 * @param {number} [updateData.original_language_id] - Originalsprache.
 * @param {number} [updateData.rental_duration] - Mietdauer.
 * @param {number} [updateData.rental_rate] - Mietpreis.
 * @param {number} [updateData.length] - Länge des Films.
 * @param {number} [updateData.replacement_cost] - Ersatzkosten.
 * @param {string} [updateData.rating] - Bewertung.
 * @param {string} [updateData.special_features] - Spezialfunktionen.
 * @returns {Promise<number | null>} - Anzahl aktualisierter Datensätze oder null, wenn der Film nicht gefunden wurde.
 * @throws {Error} - Bei Datenbankfehlern.
 */
export async function updateFilm(
    id: number,
    updateData: {
        title: string,
        description: string,
        release_year?: string,
        language_id?: number,
        original_language_id?: number,
        rental_duration?: number,
        rental_rate?: number,
        length?: number,
        replacement_cost?: number,
        rating?: string,
        special_features?: string
    }
) {
    const connection = db();

    const film = await connection("film")
        .where("film_id", id)
        .first();

    if (!film) {
        return null;
    }

    const updateOperation = await connection("film")
        .where("film_id", id)
        .update({
            title: updateData.title,
            description: updateData.description,
            release_year: updateData.release_year,
            language_id: updateData.language_id,
            original_language_id: updateData.original_language_id,
            rental_duration: updateData.rental_duration,
            rental_rate: updateData.rental_rate,
            length: updateData.length,
            replacement_cost: updateData.replacement_cost,
            rating: updateData.rating,
            special_features: updateData.special_features,
        });

    return updateOperation;
}



/**
 * Löscht einen Film anhand seiner ID.
 *
 * @param {number} id - Die ID des zu löschenden Films.
 * @returns {Promise<number>} - Anzahl der gelöschten Datensätze (0 oder 1).
 * @throws {Error} - Bei Datenbankfehlern.
 */
export async function deleteFilm(id: number): Promise<number> {
    const connection = db();
    const deleteCount = await connection("film")
        .where("film_id", id)
        .delete();
    return deleteCount;
}

/**
 * Verknüpft einen Film mit einer Kategorie.
 *
 * @param {number} categoryId - Die ID der Kategorie.
 * @param {number} filmId - Die ID des Films.
 * @returns {Promise<any>} - Das Ergebnis der Insert-Operation.
 * @throws {Error} - Bei Datenbankfehlern.
 */
export async function addFilmtoCategory(categoryId: number, filmId: number) {
    const connection = db();
    const insertOperation = await connection("film_category")
        .insert({
            category_id: categoryId,
            film_id: filmId
        });

    console.log("Inserted film to category: ", insertOperation);

    return insertOperation;
}

/**
 * Entfernt die Verknüpfung eines Films mit einer Kategorie.
 *
 * @param {number} categoryId - Die ID der Kategorie.
 * @param {number} filmId - Die ID des Films.
 * @returns {Promise<number>} - Anzahl der gelöschten Verknüpfungen.
 * @throws {Error} - Bei Datenbankfehlern.
 */
export async function deleteFilmFromCategory(categoryId: number, filmId: number) {
    const connection = db();
    const deleteOperation = await connection("film_category")
        .where("category_id", categoryId)
        .andWhere("film_id", filmId)
        .delete();

    console.log("Deleted film form category: ", deleteOperation);
    return deleteOperation;
}