import {db} from "../db";


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