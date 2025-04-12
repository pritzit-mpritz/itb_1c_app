import { db } from "../db";

/**
 * Service-Funktionen für die Kategorie-Verwaltung.
 * Bietet DB-Zugriff auf category & film_category Tabellen.
 * Ab hier aber in Englisch zur Einheitlichkeit mit der Programmierung.
 */

/**
 * Get all categories from the database
 * @param catNameFilter Optional filter for the category name (startsWith)
 *   @returns An array of category objects
 */
export async function getAllCat(catNameFilter?: string) {
    const connection = db();

    const categories = await connection
        .select("*")
        .from("category")
        .modify((queryBuilder) => {
            if (catNameFilter) {
                queryBuilder.whereLike("name", `${catNameFilter}%`);
            }
        });

    console.log("Selected categories: ", categories);
    return categories;
}

/**
 * Get a single category by ID
 * @param id The numeric ID of the category to retrieve
 *   @returns A category object or undefined if not found
 */
export async function getCatById(id: number) {
    const connection = db();

    const category = await connection
        .select("*")
        .from("category")
        .where("category_id", id)
        .first();

    console.log("Selected category: ", category);
    return category;
}

/**
 * Creates a new category
 * @param name The name of the category to create, name is the user input
 *   @returns The inserted category object
 */
export async function createCat(name: string) {
    const connection = db();

    const [insertId] = await connection("category").insert({ name });

    const newCategory = await connection("category")
        .where("category_id", insertId)
        .first();

    console.log("Created:", newCategory)
    return newCategory;
}

/**
 * Updates an existing category by ID
 * @param id The ID of the category to update
 *   @param name The new name for the category, name is the user input
 *      @returns The updated category object or null if not found
 */
export async function updateCat(id: number, name: string) {
    const connection = db();

    const affectedRows = await connection("category")
        .where("category_id", id)
        .update({ name });

    if (affectedRows === 0) return null;

    const updatedCategory = await connection("category")
        .where("category_id", id)
        .first();

    console.log("Updated:", updatedCategory)

    return updatedCategory;
}

/**
 * Deletes a category by ID
 * @param id The ID of the category to delete
 *   @returns true if deletion was successful, false otherwise
 */
export async function deleteCat(id: number) {
    const connection = db();

    const deleted = await connection("category")
        .where("category_id", id)
        .del();

    return deleted > 0;
}

/**
 * Creates a link between a film and a category (n:n relationship via film_category), but only if it does not already exist.
 * Prevents duplicate entries in the `film_category` junction table.
 *
 * @param filmId ID of the film to link
 *   @param categoryId ID of the category to link to the film
 *      @returns true if a new link was created, false if it already existed
 *          @throws Error if the DB operation fails
 */
export async function linkFilmToCatSafe(filmId: number, categoryId: number): Promise<boolean> {
    const connection = db();

    const existing = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .first();

    if (existing) {
        return false;
    }

    await connection("film_category").insert({
        film_id: filmId,
        category_id: categoryId,
    });

    return true;
}


/**
 * Deletes a link between a film and a category from the `film_category` table.
 * Does not return a value – success is assumed if no error is thrown.
 * @param filmId ID of the film
 *   @param categoryId ID of the category
 *      @returns void (throws error if operation fails) >>> : Promise<void>
 */
export async function unlinkFilmFromCat(filmId: number, categoryId: number): Promise<void> {
    const connection = db();

    await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .del();
}
