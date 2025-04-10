import { db } from "../db";

/**
 * Gibt alle Filme zurück – optional nach Titel filterbar
 *  @param titleFilter - Optionaler Filter für den Filmtitel (beginnend mit)
 *  @returns Eine Liste aller gefundenen Filme
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
 *  @param id - Die ID des Films
 *  @returns Der gefundene Film
 *  @throws Error - Wenn kein Film mit dieser ID gefunden wurde
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
 * Erstellt einen neuen Film in der Datenbank.
 *  @param data - Ein Objekt mit `title` und `description` des Films
 *  @returns Die ID des neu erstellten Films
 */
export async function createFilm(data: { title: string; description: string }) {
    const connection = db();
    const insertOperation = await connection("film").insert(data);
    return insertOperation[0]; // Gibt die ID zurück
}

/**
 * Aktualisiert einen bestehenden Film anhand seiner ID.
 *  @param id - Die ID des zu aktualisierenden Films
 *  @param data - Ein Objekt mit neuem `title` und `description`
 *  @returns Die Anzahl der aktualisierten Datensätze (normalerweise 1)
 *  @throws Error - Wenn der Film nicht gefunden wurde
 */
export async function updateFilm(id: string, data: { title: string; description: string }) {
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
 * Löscht einen Film anhand seiner ID aus der Datenbank.
 *
 *  @param id - Die ID des zu löschenden Films
 *  @returns Die Anzahl der gelöschten Datensätze (normalerweise 1)
 */
export async function deleteFilm(id: string) {
    const connection = db();
    const deleted = await connection("film")
        .where("film_id", id)
        .delete();

    return deleted;
}

/**
 * Verknüpft einen Film mit einer Kategorie in der Tabelle `film_category`.
 *
 *  @param categoryId - Die ID der Kategorie
 *  @param filmId - Die ID des Films
 *  @returns Die ID des erstellten Verknüpfungseintrags
 *  @throws Error - Wenn der Film oder die Kategorie nicht existiert oder die Verknüpfung schon vorhanden ist
 *  */
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
 * Entfernt eine Verknüpfung zwischen einem Film und einer Kategorie.
 *
 * @param categoryId - Die ID der Kategorie
 * @param filmId - Die ID des Films
 * @returns Die Anzahl der gelöschten Verknüpfungen (normalerweise 1)
 */
export async function removeFilmFromCategory(categoryId: number, filmId: number) {
    const connection = db();
    const deleted = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .delete();

    return deleted;
}
