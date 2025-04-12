import {db} from "../db";


/**
 * Get all categories from the database
 * @param NameFilter Optional filter for the category name
 */

export async function getAllCategories(NameFilter?: string){
const connection = db();

    const categories = await connection
        .select("*")
        .from("category")                           //Rüft die Tabelle 'category' auf
        .whereLike("name", `${NameFilter}%`)        //Rüft in der Tabelle 'category' die Spalte 'name' auf und vergleicht ihn mit dem Filter

    console.log("Selected category: ", categories);

    return categories;


}

/**
 * Get a category by its ID from the database
 * @param id The ID of the category to retrieve
 * @throws Error If the category is not found
 */

export async function getCategoryById(id: number) {
    const connection = db();
    const category = await connection
        .select("*")
        .from("category")
        .where("category_id", id)
        .first();

    if (!category) throw new Error("Kategorie konnte nicht gefunden werden!");

    console.log("Selected category: ", category);
    return category;
}

/**
 * Create a new category association in the database
 * @param data The data to insert into the 'film_category' table
 * @returns The ID of the newly created association
 */

export const createCategory = async (data: any) => {
    const connection = db();                                                                    //Verbindung mit der Datenbank wird hergestellt
    const insertOperation = await connection.insert(data).into('category');            //Fügt die neue Kategorie in der Datenbank zu der Tabelle Category hinzu
    return insertOperation[0];
};

/**
 * Update an existing category in the database
 * @param id The ID of the category to update
 * @param newName The new name for the category
 * @returns The number of affected rows after the update operation
 * @throws Error if the category is not found
 */

export const updateCategory = async (id: string, newName: string) => {
    const connection = db();
    const category = await connection
        .select('*')
        .from('category')
        .where('category_id', id)
        .first();

    if (!category) throw new Error('Kategorie konnte nicht aktualisiert werden');

    category.name = newName;

    const updateOperation = await connection('category')
        .update(category)
        .where('category_id', id);

    console.log(updateOperation);

    return updateOperation;
};
/**
 * Delete a category from the database
 * @param id The ID of the category to delete
 * @returns The number of rows deleted
 */


export const deleteCategory = async (id: string) => {
    const connection = db();
    const deleteOperation = await connection('category')
        .where('category_id', id)
        .delete();

    console.log(deleteOperation);

    return deleteOperation;
};




