import { db } from "../db";

/**
 * Fügt eine Verknüpfung zwischen einem Film und einer Kategorie hinzu.
 * Schreibt einen Eintrag in die Zwischentabelle "film_category".
 *
 * @param categoryId Die ID der Kategorie, die dem Film zugeordnet werden soll
 * @param filmId Die ID des Films, der zugeordnet wird
 * @returns Das Ergebnis der Einfügeoperation
 */
export async function addFilmToCategory(categoryId: number, filmId: number) {
    const connection = db();
    const insertOperation = await connection("film_category").insert({
        category_id: categoryId,
        film_id: filmId
    });

    console.log("Film-Kategorie-Verknüpfung eingefügt: ", insertOperation);
    return insertOperation;
}

