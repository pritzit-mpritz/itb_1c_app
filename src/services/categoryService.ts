// src/services/categoryService.ts
import { db } from "../db";

const TABLE_NAME = 'category'; // Anpassen, falls nötig

/**
 * Gibt alle Kategorien zurück.
 */
export async function getAllCategories(): Promise<any[]> {
    const connection = db();
    try {
        return await connection(TABLE_NAME).select('*');
    } catch (error) {
        console.error(`Error fetching all categories from ${TABLE_NAME}:`, error);
        throw error;
    }
}

/**
 * Gibt eine Kategorie anhand ihrer ID zurück.
 */
export async function getCategoryById(categoryId: number): Promise<any | undefined> {
    const connection = db();
    try {
        return await connection(TABLE_NAME).where('category_id', categoryId).first();
    } catch (error) {
        console.error(`Error fetching category with ID ${categoryId}:`, error);
        throw error;
    }
}

/**
 * Erstellt eine neue Kategorie.
 * @param categoryData Objekt mit Kategoriedaten (z.B. { name: '...' }).
 */
export async function createCategory(categoryData: object): Promise<any | undefined> {
    const connection = db();
    try {
        const [insertedId] = await connection(TABLE_NAME).insert(categoryData);
        if (insertedId) {
            return getCategoryById(insertedId);
        }
        console.error("Category creation did not return an ID.");
        return undefined;
    } catch (error: any) {
        console.error(`Error creating category:`, error);
        throw error; // Fehler (inkl. Duplicate Entry) wird weitergeworfen
    }
}

/**
 * Aktualisiert eine vorhandene Kategorie.
 *  * @param {number} categoryId - Die ID der Kategorie, die aktualisiert werden soll.
 *  * @param {object} categoryData - Objekt mit zu aktualisierenden Feldern.
 *  * @returns {Promise<any | undefined>} Gibt die aktualisierte Kategorie zurück oder `undefined`, wenn sie nicht gefunden wurde.
 */
export async function updateCategory(categoryId: number, categoryData: object): Promise<any | undefined> {
    const connection = db();
    try {
        const affectedRows = await connection(TABLE_NAME)
            .where('category_id', categoryId)
            .update(categoryData);
        if (affectedRows > 0) {
            return getCategoryById(categoryId);
        } else {
            return undefined; // Nicht gefunden
        }
    } catch (error) {
        console.error(`Error updating category ${categoryId}:`, error);
        throw error; // Fehler (inkl. Duplicate Entry) wird weitergeworfen
    }
}

/**
 * Löscht eine Kategorie.
 */
export async function deleteCategory(categoryId: number): Promise<number> {
    const connection = db();
    try {
        return await connection(TABLE_NAME).where('category_id', categoryId).del();
    } catch (error) {
        console.error(`Error deleting category ${categoryId}:`, error);
        throw error; // Fehler (inkl. FK Constraint) wird weitergeworfen
    }
}