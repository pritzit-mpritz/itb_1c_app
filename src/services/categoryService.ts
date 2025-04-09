// src/services/categoryService.ts
import { db } from "../db";

const TABLE_NAME = 'category';

/**
 * Holt alle Kategorien.
 * @returns {Promise<any[]>} Array aller Kategorie-Objekte.
 * @throws {Error} Datenbankfehler.
 */
export async function getAllCategories(): Promise<any[]> {
    const connection = db();
    return connection(TABLE_NAME).select('*');
}

/**
 * Holt eine Kategorie anhand ihrer ID.
 * @param {number} categoryId ID der Kategorie.
 * @returns {Promise<any | undefined>} Das Kategorie-Objekt oder undefined.
 * @throws {Error} Datenbankfehler.
 */
export async function getCategoryById(categoryId: number): Promise<any | undefined> {
    const connection = db();
    return connection(TABLE_NAME).where('category_id', categoryId).first();
}