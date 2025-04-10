import {db} from "../db";


export async function getAllCategories(NameFilter?: string){
const connection = db();

    const categories = await connection
        .select("*")
        .from("film_category")
        .whereLike("name", `${NameFilter}%`)

    console.log("Selected category: ", categories);

    return categories;


}

/**
 * */
export async function getCategoryById(id: number) {
    const connection = db();
    const category = await connection.select("*")
        .from("category")
        .where("category_id", id)
        .first();

    if (!category) throw new Error("Category not found");

    console.log("Selected category: ", category);
    return category;
}

/**
 * */
export const createFilmCategory = async (data: any) => {
    const connection = db();
    const insertOperation = await connection.insert(data).into('film_category');
    return insertOperation[0];
};

/**
 *
 */
export const updateCategory = async (id: string, newName: string) => {
    const connection = db();
    const category = await connection
        .select('*')
        .from('category')
        .where('category_id', id)
        .first();

    if (!category) throw new Error('Category not found');

    category.name = newName;

    const updateOperation = await connection('category')
        .update(category)
        .where('category_id', id);

    return updateOperation;
};

export const deleteCategory = async (id: string) => {
    const connection = db();
    const deleteOperation = await connection('category')
        .where('category_id', id)
        .delete();

    return deleteOperation;
};




