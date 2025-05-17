import { Film } from "./film";

export interface Actor {
    actor_id: number;
    first_name: string;
    last_name: string;
    birth_year?: number;
    films?: Film[]; // Optional: Nur auf Detailseite nötig
}

export interface CreateActorDTO {
    first_name: string;
    last_name: string;
    birth_year?: number;
}
