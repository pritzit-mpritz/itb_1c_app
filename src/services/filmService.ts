import {db} from "../db";
import film from "../routes/film";

/**
 * Get all film from the database
 * @param titleFilter Optional filter for the title name of the film
 */
export async function getAllFilm(titleFilter?: string) {
    const connection = db();
    // const film = await connection.select("*").from("film")
    //     .whereLike("first_name", `%${firstNameFilter}%`);

    const film = await connection
        .select("*")
        .from("title")
        .whereLike("title", `${titleFilter}%`)

    console.log("Selected film: ", film);

    return film;
}

export async function getfilmById(id: number) {
    const connection = db();
    const film = await connection.select("*")
        .from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
}

/**
 * Adds an film-film relation
 * @param film Id the film to add to a film
 * @param filmId the film the film is added to
 */
export async function addFilmToFilm(film: number, filmId: number) {
    const connection = db();
    const insertOperation = await connection("film_film")
        .insert({
            film_id: filmId,
            film: film
        });

    console.log("Inserted film to film: ", insertOperation);

    return insertOperation;
}