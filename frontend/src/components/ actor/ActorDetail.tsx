import React, { useEffect, useState } from "react";
import { Actor, Film } from "../../interfaces/actor";
import ActorService from "../../api/ActorService";

interface ActorDetailProps {
    actorId: number;
    onBack: () => void;
}

const ActorDetail: React.FC<ActorDetailProps> = ({ actorId, onBack }) => {
    const [actor, setActor] = useState<Actor | null>(null);
    const [loading, setLoading] = useState(true);
    const [filmIdToAdd, setFilmIdToAdd] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const fetchActor = async () => {
        setLoading(true);
        try {
            const data = await ActorService.getActorById(actorId);
            setActor(data);
        } catch {
            setError("Fehler beim Laden des Schauspielers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActor();
        // eslint-disable-next-line
    }, [actorId]);

    const handleRemoveFilm = async (filmId: number) => {
        await ActorService.removeFilmFromActor(actorId, filmId);
        fetchActor();
    };

    const handleAddFilm = async () => {
        if (!filmIdToAdd) return;
        await ActorService.addFilmToActor(actorId, Number(filmIdToAdd));
        setFilmIdToAdd("");
        fetchActor();
    };

    if (loading) return <div>Lade Details...</div>;
    if (!actor) return <div>{error ?? "Schauspieler nicht gefunden."}</div>;

    return (
        <div>
            <button onClick={onBack}>Zurück</button>
            <h2>{actor.first_name} {actor.last_name} ({actor.birth_year ?? "?"})</h2>
            <h3>Filme</h3>
            <ul>
                {actor.films && actor.films.length > 0 ? (
                    actor.films.map(film => (
                        <li key={film.film_id}>
                            {film.title}
                            <button onClick={() => handleRemoveFilm(film.film_id)}>Entfernen</button>
                        </li>
                    ))
                ) : (
                    <li>Keine Filme zugeordnet.</li>
                )}
            </ul>
            <div>
                <input
                    type="number"
                    placeholder="Film-ID hinzufügen"
                    value={filmIdToAdd}
                    onChange={e => setFilmIdToAdd(e.target.value)}
                />
                <button onClick={handleAddFilm}>Film zuordnen</button>
            </div>
        </div>
    );
};

export default ActorDetail;
