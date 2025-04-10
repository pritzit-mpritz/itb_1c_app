import { db } from "../db";

/**
 * Gibt alle Filme zurück – optional nach Titel filterbar
 */
export async function getAllFilms(titleFilter?: string) {
    const connection = db();

    const films = await connection
        .select("*")
        .from("film")
        .modify((query) => {
            if (titleFilter) {
                query.whereLike("title", `${titleFilter}%`);
            }
        });

    console.log("Gefundene Filme:", films);
    return films;
}

/**
 * Gibt einen Film anhand seiner ID zurück
 */
export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection("film")
        .select("*")
        .where("film_id", id)
        .first();

    if (!film) throw new Error("Film nicht gefunden");

    console.log("Gefundener Film:", film);
    return film;
}

/**
 * Erstellt einen neuen Film
 */
export async function createFilm(data: { title: string; description: string }) {
    const connection = db();
    const insertOperation = await connection("film").insert(data);
    return insertOperation[0]; // Gibt die ID zurück
}

/**
 * Aktualisiert einen Film anhand der ID
 */
export async function updateFilm(id: number, data: { title: string; description: string }) {
    const connection = db();

    const film = await connection("film")
        .select("*")
        .where("film_id", id)
        .first();

    if (!film) throw new Error("Film nicht gefunden");

    const updated = await connection("film")
        .update(data)
        .where("film_id", id);

    return updated;
}

/**
 * Löscht einen Film anhand der ID
 */
export async function deleteFilm(id: number) {
    const connection = db();
    const deleted = await connection("film")
        .where("film_id", id)
        .delete();

    return deleted;
}

/**
 * Verknüpft einen Film mit einer Kategorie (film_category)
 */
export async function addFilmToCategory(categoryId: number, filmId: number) {
    const connection = db();

    const film = await connection("film").where("film_id", filmId).first();
    if (!film) throw new Error(`Film mit ID ${filmId} existiert nicht`);

    const category = await connection("category").where("category_id", categoryId).first();
    if (!category) throw new Error(`Kategorie mit ID ${categoryId} existiert nicht`);

    const existing = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .first();

    if (existing) throw new Error("Verknüpfung existiert bereits");

    const insertOperation = await connection("film_category").insert({
        category_id: categoryId,
        film_id: filmId,
    });

    console.log("Film-Kategorie-Verknüpfung eingefügt:", insertOperation);
    return insertOperation[0];
}

/**
 * Entfernt eine Verknüpfung zwischen Film und Kategorie
 */
export async function removeFilmFromCategory(categoryId: number, filmId: number) {
    const connection = db();
    const deleted = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .delete();

    return deleted;
}
