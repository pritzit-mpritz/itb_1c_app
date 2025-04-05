import { db } from "../db"; // db() fun. wird mitgebracht


/**
 * Get all categories from the database
 * @param CategoryName Optional filter for the name of the category
 */

// 1.get wird erstellt
export async function getAllCategory() {
    const connection = db();
    const category = await connection
        .select("*")
        .from("category");

    console.log("Selected categories: ", category);

    return category;
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

    console.log("Selected categories:", category); // Ergebnis in Konsole zeigen

    return category; // Kategorie zurückgeben
}


//insert wird erstellt
/**
 * Adds a category-film relation
 * @param categoryId the category to add to a film
 * @param filmId the film the category is added to
 */
export async function addCategoryToFilm(categoryId: number, filmId: number) {
    const connection = db(); // Verbindung zur Datenbank öffnen

    // Einfügen die Kategorie-Film-Beziehung in die Tabelle film_category
    const insertOperation = await connection("film_category")
        .insert({
            category_id: categoryId, // Kategorie ID
            film_id: filmId // Film ID
        });

    console.log("Kategorie zum Film hinzugefügt: ", insertOperation); // Erfolgreiche Einfügung wird in der Konsole angezeigt

    return insertOperation; // Ergebnis zurückgeben
}








