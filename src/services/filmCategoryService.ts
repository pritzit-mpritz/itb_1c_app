// src/services/filmCategoryService.ts
import { db } from "../db";

const FC_TABLE = 'film_category';
const FILM_TABLE = 'film';
const CATEGORY_TABLE = 'category';

/**
 * Fügt eine Film-Kategorie-Verknüpfung hinzu.
 * @param {number} filmId Film ID
 * @param {number} categoryId Kategorie ID
 * @returns {Promise<any>} Das Ergebnis der Knex-Insert-Operation.
 * @throws {Error} Datenbankfehler (z.B. FK nicht gefunden, Duplicate Key).
 */
export async function addFilmCategoryLink(filmId: number, categoryId: number) {
    const connection = db();
    // Einfaches Insert. Fehler (FK, Duplicate) werden im Router gefangen.
    return connection(FC_TABLE).insert({
        film_id: filmId,
        category_id: categoryId
        // last_update wird von Sakila DB automatisch gesetzt
    });
}

/**
 * Entfernt eine Film-Kategorie-Verknüpfung.
 * @param {number} filmId Film ID
 * @param {number} categoryId Kategorie ID
 * @returns {Promise<number>} Anzahl der gelöschten Zeilen (0 oder 1).
 * @throws {Error} Datenbankfehler.
 */
export async function removeFilmCategoryLink(filmId: number, categoryId: number): Promise<number> {
    const connection = db();
    return connection(FC_TABLE)
        .where({ film_id: filmId, category_id: categoryId })
        .delete();
}

/**
 * Holt alle Kategorien für einen bestimmten Film.
 * @param {number} filmId Film ID
 * @returns {Promise<any[]>} Array von Kategorie-Objekten.
 * @throws DB-Fehler.
 */
export async function getCategoriesForFilm(filmId: number): Promise<any[]> {
    const connection = db();
    return connection(CATEGORY_TABLE)
        .join(FC_TABLE, `${CATEGORY_TABLE}.category_id`, '=', `${FC_TABLE}.category_id`)
        .where(`${FC_TABLE}.film_id`, filmId)
        .select(`${CATEGORY_TABLE}.*`);
}

/**
 * Holt alle Filme für eine bestimmte Kategorie.
 * @param {number} categoryId Kategorie ID
 * @returns {Promise<any[]>} Array von Film-Objekten.
 * @throws DB-Fehler.
 */
export async function getFilmsForCategory(categoryId: number): Promise<any[]> {
    const connection = db();
    return connection(FILM_TABLE)
        .join(FC_TABLE, `${FILM_TABLE}.film_id`, '=', `${FC_TABLE}.film_id`)
        .where(`${FC_TABLE}.category_id`, categoryId)
        .select(`${FILM_TABLE}.*`);
}