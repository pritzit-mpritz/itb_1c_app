// noinspection UnnecessaryLocalVariableJS

import {db} from "../db";

/**
 * Retrieve a list of all films from database.
 * @returns a list of all films with all details from database.
 */
export async function getAllFilms() {
    const connection = db();
    const films = await connection.select("*").from("film");

    console.log("Selected films: ", films);

    return films;
}

/**
 * Retrieve a film by ID.
 * @param id filter to find film by ID.
 * @returns one film with all details that matches the provided ID.
 */
export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection.select("*").from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
}

/**
 * Create a new film. Required values are title, description and language_id.
 * @param body takes in title, description and language_id to create a new film.
 * @returns the ID of the new film and saves the film into the database.
 */
export async function createFilm(body: string) {
    console.log("Creating film: ", body);

    const connection = db();
    const insertOperation = await connection.insert(body).into("film");

    return insertOperation;
}

/**
 * Update the title and description of a film.
 * @param body takes in new title and description to update current ones.
 * @param id takes in ID to know which film needs to be updated.
 * @returns number of films that have been updated and updates the film in the database.
 */
export async function updateFilm(body: any, id: number) {
    const connection = db();

    // noinspection UnnecessaryLocalVariableJS
    const updateOperation = await connection("film").update({
        title: body.title,
        description: body.description
    })
        .where("film_id", id)

    return updateOperation;
}

/**
 * Delete a film by ID.
 * @param id filter to find film by ID to delete.
 * @returns number of films that have been deleted and deletes the film from the database.
 */
export async function deleteFilm(id: number) {
    const connection = db();
    const deleteOperation = await connection("film")
        .where("film_id", id).delete();

    return deleteOperation;
}

/**
 * Adds a film-category relation
 * @param filmId the film to add to a category
 * @param categoryId the category the film is added to
 * @returns ID of the inserted relation and adds relation to database.
 */
export async function addCategoryToFilm(filmId: number, categoryId: number) {
    const connection = db();
    const insertOperation = await connection("film_category")
        .insert({
            film_id: filmId,
            category_id: categoryId
        });

    console.log("Inserted film to category: ", insertOperation);

    return insertOperation;
}

/**
 * Deletes a film-category relation
 * @param filmId the film to delete from relation
 * @param categoryId the category to delete from relation
 * @returns number of deleted relations and deletes relation from database.
 */
export async function removeCategoryFromFilm(filmId: number, categoryId: number) {
    const connection = db();
    const deleteOperation = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId }).delete();

    console.log("Deleted Film-Category relation: ", deleteOperation);

    return deleteOperation;
}