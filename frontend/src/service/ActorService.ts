const baseUrl = "http://localhost:3000/actor";

export async function getAllActors() {
    console.log("Start GetActors")

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching actors: ", response.status);
        return undefined;
    }

    const tempActors = await response.json();
    return tempActors.data;
}

/**
 * Lädt einen einzelnen Actor anhand der ID vom Server.
 * @param id - Die Actor-ID
 * @returns Ein Actor-Objekt oder undefined bei Fehler
 */
export async function getActorById(id: string) {
    console.log("Start GetActorById");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    console.log("Got response from server: ", response);

    if (!response.ok) {
        console.error("Error while fetching actor: ", response.status);
        return undefined;
    }

    const tempActor = await response.json();
    return tempActor.data;
}

/**
 * Erstellt einen neuen Schauspieler.
 */
export async function createActor(actor: object) {
    console.log("Start CreateActor");

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor)
    });

    console.log("CreateActor response: ", response);

    if (!response.ok) {
        console.error("Error while creating actor: ", response.status);
        return false;
    }

    return true;
}

/**
 * Aktualisiert einen bestehenden Schauspieler.
 */
export async function updateActor(id: string, actor: object) {
    console.log("Start UpdateActor");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor)
    });

    console.log("UpdateActor response: ", response);

    if (!response.ok) {
        console.error("Error while updating actor: ", response.status);
        return false;
    }

    return true;
}

/**
 * Löscht einen Schauspieler anhand der ID.
 */
export async function deleteActor(id: string) {
    console.log("Start DeleteActor");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log("DeleteActor response: ", response);

    if (!response.ok) {
        console.error("Error while deleting actor: ", response.status);
        return false;
    }

    return true;
}