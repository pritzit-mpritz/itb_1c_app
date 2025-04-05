import {db} from "../db";


export async function getAllFilms(titleFilter?: string) {
    const connection = db();
    // const actors = await connection.select("*").from("actor")
    //     .whereLike("first_name", `%${firstNameFilter}%`);
}

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