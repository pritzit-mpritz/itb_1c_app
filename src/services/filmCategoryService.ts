// src/services/filmCategoryService.ts
import { db } from "../db";

const FC_TABLE = 'film_category';
const FILM_TABLE = 'film'; // Passe an, falls 'films'
const CATEGORY_TABLE = 'category'; // Passe an, falls 'categories'

/**
 * Fügt eine Verknüpfung hinzu. Idempotent.
 * @returns True bei Erfolg, false bei FK-Constraint-Fehler.
 * @throws Wirft andere DB-Fehler.
 */
export async function addLink(filmId: number, categoryId: number): Promise<boolean> {
    const connection = db();
    const linkData = { film_id: filmId, category_id: categoryId };
    try {
        const existingLink = await connection(FC_TABLE).where(linkData).first();
        if (!existingLink) {
            await connection(FC_TABLE).insert(linkData);
            console.log(`Linked film ${filmId} and category ${categoryId}`);
        } else {
            console.log(`Link film ${filmId} <-> category ${categoryId} already exists.`);
        }
        return true;
    } catch (error: any) {
        if (error?.errno === 1452 || error?.code?.includes('FOREIGN KEY')) {
            console.warn(`Cannot add link: Film ${filmId} or Category ${categoryId} does not exist.`);
            return false;
        }
        console.error(`Error adding link film ${filmId} <-> category ${categoryId}:`, error);
        throw error;
    }
}

/**
 * Entfernt eine Verknüpfung.
 * @returns Anzahl der gelöschten Zeilen (0 oder 1).
 */
export async function removeLink(filmId: number, categoryId: number): Promise<number> {
    const connection = db();
    try {
        const deleteCount = await connection(FC_TABLE)
            .where({ film_id: filmId, category_id: categoryId })
            .del();
        console.log(`Attempted remove link film ${filmId} <-> category ${categoryId}. Removed: ${deleteCount}`);
        return deleteCount;
    } catch (error) {
        console.error(`Error removing link film ${filmId} <-> category ${categoryId}:`, error);
        throw error;
    }
}

/**
 * Ruft alle Kategorien für einen Film ab.
 * @returns Array von Kategorie-Objekten.
 */
export async function getCategoriesForFilm(filmId: number): Promise<any[]> {
    const connection = db();
    try {
        return await connection(CATEGORY_TABLE)
            .join(FC_TABLE, `${CATEGORY_TABLE}.category_id`, '=', `${FC_TABLE}.category_id`)
            .where(`${FC_TABLE}.film_id`, filmId)
            .select(`${CATEGORY_TABLE}.*`);
    } catch(error) {
        console.error(`Error fetching categories for film ${filmId}:`, error);
        throw error;
    }
}

/**
 * Ruft alle Filme für eine Kategorie ab.
 * @returns Array von Film-Objekten.
 */
export async function getFilmsForCategory(categoryId: number): Promise<any[]> {
    const connection = db();
    try {
        return await connection(FILM_TABLE)
            .join(FC_TABLE, `${FILM_TABLE}.film_id`, '=', `${FC_TABLE}.film_id`)
            .where(`${FC_TABLE}.category_id`, categoryId)
            .select(`${FILM_TABLE}.*`);
    } catch(error) {
        console.error(`Error fetching films for category ${categoryId}:`, error);
        throw error;
    }
}