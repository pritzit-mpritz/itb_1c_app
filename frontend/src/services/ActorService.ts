// src/services/ActorService.ts
import { Actor } from "../types/types";

const baseUrl = "http://localhost:3000/actor";

export async function getAllActors(): Promise<Actor[]> {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error("Fehler beim Laden der Actors");
        const data = await response.json();
        return data.data as Actor[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getActorById(id: number): Promise<Actor | null> {
    try {
        const response = await fetch(`${baseUrl}/${id}`);
        if (!response.ok) throw new Error("Actor nicht gefunden");
        const data = await response.json();
        return data.data as Actor;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function createActor(actor: Actor): Promise<void> {
    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });
}

export async function updateActor(id: number, actor: Actor): Promise<void> {
    await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });
}

export async function deleteActor(id: number): Promise<void> {
    await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
}
