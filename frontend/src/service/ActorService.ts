const baseUrl = "http://localhost:3000/actors";

export async function getAllActors() {
    console.log("Start getAllActors");

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.error("Error while fetching actors:", response.status);
        return undefined;
    }

    const result = await response.json();
    console.log("Successfully getAllActors", result);
    return result;
}

export async function getActorById(id: string) {
    console.log(`Start getActorById: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.error(`Error while fetching actor with id ${id}:`, response.status);
        return undefined;
    }

    const result = await response.json();
    console.log ("Successfully getActorById", result);
    return result;
}

export async function createActor(actor: { id: string; first_name: string; last_name: string }) {
    console.log("Start createActor");

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor),
    });

    if (!response.ok) {
        console.error("Error while creating actor:", response.status);
        return undefined;
    }

    const result = await response.json();
    console.log("Successfully createActor", result);
    return result;
}

export async function updateActor(id: string, actor: { first_name?: string; last_name?: string }) {
    console.log(`Start updateActor: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor),
    });

    if (!response.ok) {
        console.error(`Error while updating actor with id ${id}:`, response.status);
        return undefined;
    }

    const result = await response.json();
    console.log("Successfully updateActor", result);
    return result;
}

export async function deleteActor(id: string) {
    console.log(`Start deleteActor: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.error(`Error while deleting actor with id ${id}:`, response.status);
        return false;
    }

    const result = await response.json();
    console.log("Successfully deleteActor", result);
    return result;
}
