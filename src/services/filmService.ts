// Import der Datenbankverbindung
import { db } from "../db";

/**
 * Gibt alle Filme zurück – optional nach Titel filterbar
 *  @param titleFilter - Optionaler Filter für den Filmtitel (beginnend mit)
 *  @returns Eine Liste aller gefundenen Filme
 */
export async function getAllFilms(titleFilter?: string): Promise<any[]> {
    const connection = db(); //Verbindung zur Datenbank aufbauen

    const films = await connection
        .select("*") // Alle Spalten auswählen
        .from("film") // Aus Tabelle "film"
        .modify((query) => { // Optionalen Filter anwenden
            if (titleFilter) {
                query.whereLike("title", `${titleFilter}%`); // Titel beginnt mit Filter
            }
        });

    console.log("Gefundene Filme:", films); // Für Debug-Zwecke
    return films; // Gefundene Filme zurückgeben
}

/**
 * Gibt einen Film anhand seiner ID zurück
 *  @param id - Die ID des Films
 *  @returns Der gefundene Film
 *  @throws Error - Wenn kein Film mit dieser ID gefunden wurde
 */
export async function getFilmById(id: number) {
    const connection = db(); // DB-Verbindung
    const film = await connection("film") // Tabelle "film"
        .select("*")  // Alle Spalten
        .where("film_id", id) // Wo ID übereinstimmt
        .first(); // Nur den ersten Treffer holen

    if (!film) throw new Error("Film nicht gefunden"); // Wenn kein Film gefunden → Fehler werfen

    console.log("Gefundener Film:", film); // Debug-Ausgabe
    return film; // Film zurückgeben
}

/**
 * Erstellt einen neuen Film in der Datenbank.
 *  @param data - Ein Objekt mit `title` und `description` des Films
 *  @returns Die ID des neu erstellten Films
 */
export async function createFilm(data: { title: string; description: string }) {
    const connection = db(); // DB-Verbindung
    const insertOperation = await connection("film")  // In Tabelle "film"
        .insert(data); // Neuen Datensatz mit Titel + Beschreibung
    return insertOperation[0]; // Rückgabe: ID des neu eingefügten Films
}

/**
 * Aktualisiert einen bestehenden Film anhand seiner ID.
 *  @param id - Die ID des zu aktualisierenden Films
 *  @param {object} data - Die neuen Filmdaten.
 *  @param {string} data.title - Titel des Films.
 *  @param {string} data.description - Beschreibung des Films.
 *  @param {string} [data.release_year] - Erscheinungsjahr.
 *  @param {number} [data.language_id] - Sprache.
 *  @param {number} [data.original_language_id] - Originalsprache.
 *  @param {number} [data.rental_duration] - Mietdauer.
 *  @param {number} [data.rental_rate] - Mietpreis.
 *  @param {number} [data.length] - Länge des Films.
 *  @param {number} [data.replacement_cost] - Ersatzkosten.
 *  @param {string} [data.rating] - Bewertung.
 *  @param {string} [data.special_features] - Spezialfunktionen.
 *  @param data - Ein Objekt mit neuen Datensätzen
 *  @returns Die Anzahl der aktualisierten Datensätze (normalerweise 1)
 *  @throws Error - Wenn der Film nicht gefunden wurde
 */
export async function updateFilm(id: number, data: {
    title: string;
    description: string;
    release_year?: string;
    language_id?: number;
    original_language_id?: number;
    rental_duration?: number;
    rental_rate?: number;
    length?: number;
    replacement_cost?: number;
    rating?: string;
    special_features?: string
}) {
    const connection = db();

    const film = await connection("film")
        .select("*")
        .where("film_id", id)
        .first(); // Prüfen ob Film existiert

    if (!film) throw new Error("Film nicht gefunden"); // Wenn nicht: Fehler werfen

    const updateOperation = await connection("film")
        .update({                   // Aktualisierte Felder:
                    title: data.title,
                    description: data.description,
                    release_year: data.release_year,
                    language_id: data.language_id,
                    original_language_id: data.original_language_id,
                    rental_duration: data.rental_duration,
                    rental_rate: data.rental_rate,
                    length: data.length,
                    replacement_cost: data.replacement_cost,
                    rating: data.rating,
                    special_features: data.special_features,
                })
        .where("film_id", id); // Nur der Film mit passender ID wird aktualisiert

    console.log(updateOperation); // Zeigt Anzahl geänderter Zeilen

    return updateOperation;
}


/**
 * Löscht einen Film anhand seiner ID aus der Datenbank.
 *
 *  @param id - Die ID des zu löschenden Films
 *  @returns Die Anzahl der gelöschten Datensätze (normalerweise 1)
 */
export async function deleteFilm(id: string) {
    const connection = db(); // DB-Verbindung
    const deleteOperation = await connection("film")
        .where("film_id", id) // Wo ID übereinstimmt
        .delete(); // Datensatz löschen

    console.log(deleteOperation); // Debug-Ausgabe

    return deleteOperation; // Anzahl gelöschter Zeilen
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
    const connection = db(); // DB-Verbindung

    const film = await connection("film").where("film_id", filmId).first(); // Film prüfen
    if (!film) throw new Error(`Film mit ID ${filmId} existiert nicht`);

    const category = await connection("category").where("category_id", categoryId).first(); // Kategorie prüfen
    if (!category) throw new Error(`Kategorie mit ID ${categoryId} existiert nicht`); // Gibt es diese Verknüpfung schon?

    const existing = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .first();

    if (existing) throw new Error("Verknüpfung existiert bereits");

    const insertOperation = await connection("film_category").insert({
        category_id: categoryId,
        film_id: filmId,
    }); // Verknüpfung einfügen

    console.log("Film-Kategorie-Verknüpfung eingefügt:", insertOperation); // Debug
    return insertOperation[0]; // ID der neuen Verknüpfung zurückgeben
}

/**
 * Entfernt die Verknüpfung zwischen einem Film und einer Kategorie
 * @param categoryId ID der Kategorie
 * @param filmId ID des Films
 */
export async function removeFilmFromCategory(categoryId: number, filmId: number) {
    const connection = db(); // DB-Verbindung

    const existing = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .first(); // Prüfen, ob Verknüpfung existiert

    if (!existing) throw new Error("Verknüpfung existiert nicht"); // Wenn nicht: Fehler

    const deleteOperation = await connection("film_category")
        .where({ film_id: filmId, category_id: categoryId })
        .delete(); // Verknüpfung löschen

    console.log(`Verknüpfung Film ${filmId} - Kategorie ${categoryId} gelöscht:`, deleteOperation);
    return deleteOperation; // Anzahl gelöschter Zeilen
}


