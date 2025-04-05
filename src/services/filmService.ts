import {db} from "../db";

/**
 * Retrieve a list of all films from database
 */
export async function getAllFilms() {
    const connection = db();
    const films = await connection.select("*").from("film");

    console.log("Selected films: ", films);

    return films;
}

/**
 * Retrieve a film by ID
 */
export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection.select("*").from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
}