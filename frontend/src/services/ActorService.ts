import { Actor } from "../types/types";

const baseUrl = "http://localhost:3000/actor";

/**
 * Holt alle Schauspieler vom Server.
 * @returns {Promise<Actor[]>}
 */
export async function getAllActors(): Promise<Actor[]> {
    try {
        const response = await fetch(baseUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Schauspieler: ${response.status}`);
        }

        const data = await response.json();
        return data.data as Actor[]; // ACHTUNG: .data nur, wenn das Backend so antwortet!
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Holt einen einzelnen Schauspieler anhand seiner ID.
 * @param id Schauspieler-ID
 * @returns {Promise<Actor | null>}
 */
export async function getActorById(id: number): Promise<Actor | null> {
    try {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Schauspieler nicht gefunden");
        const data = await response.json();
        return data.data as Actor; // ACHTUNG: .data nur, wenn das Backend so antwortet!
    } catch (e) {
        console.error(e);
        return null;
    };