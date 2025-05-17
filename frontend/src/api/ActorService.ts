import axios from "axios";
import { Actor, CreateActorDTO } from "../interfaces/actor";
import { film } from "../interfaces/film";

/**
 * Service für alle API-Zugriffe bezüglich Actor.
 */
class ActorService {
    private baseUrl = "/actor";

    async getAllActors(): Promise<Actor[]> {
        const { data } = await axios.get<Actor[]>(this.baseUrl);
        return data;
    }

    async getActorById(actorId: number): Promise<Actor> {
        const { data } = await axios.get<Actor>(`${this.baseUrl}/${actorId}`);
        return data;
    }

    async createActor(actor: CreateActorDTO): Promise<Actor> {
        const { data } = await axios.post<Actor>(this.baseUrl, actor);
        return data;
    }

    async updateActor(actorId: number, actor: CreateActorDTO): Promise<Actor> {
        const { data } = await axios.put<Actor>(`${this.baseUrl}/${actorId}`, actor);
        return data;
    }

    async deleteActor(actorId: number): Promise<void> {
        await axios.delete(`${this.baseUrl}/${actorId}`);
    }

    async addFilmToActor(actorId: number, filmId: number): Promise<void> {
        await axios.post(`${this.baseUrl}/${actorId}/films`, { film_id: filmId });
    }

    async removeFilmFromActor(actorId: number, filmId: number): Promise<void> {
        await axios.delete(`${this.baseUrl}/${actorId}/films/${filmId}`);
    }
}

export default new ActorService();
