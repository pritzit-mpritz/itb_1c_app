import { db } from "../db"; // db() fun. wird mitgebracht


/**
 * Get all categories from the database
 * @param CategoryName Optional filter for the name of the category
 */

// 1.get wird erstellt
export async function getAllCategory(CategoryName?: string) {
    const connection = db(); // Verbindung zur DB öffnen

    const categories = await connection
        .select("*")
        .from("category")
        .whereLike("name", `${CategoryName || ""}%`);
    // Kategorien holen, optional nach Name filtern

    console.log("Gefundene Kategorien:", categories); // Ergebnis in Konsole zeigen

    return categories; // Kategorien zurückgeben
}




/**
 * Get a category by ID
 * @param id The ID of the category
 */

// 2.get wird erstellt
export async function getCategoryById(id: number) {
    const connection = db(); // Verbindung zur DB öffnen

    const category = await connection
        .select("*")
        .from("category")
        .where("category_id", id)
        .first();
    // Kategorie mit passender ID holen

    console.log("Gefundene Kategorie:", category); // Ergebnis in Konsole zeigen

    return category; // Kategorie zurückgeben
}



