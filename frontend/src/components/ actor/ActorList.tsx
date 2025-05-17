import React, { useEffect, useState } from "react";
import ActorService from "../../api/ActorService";
import { Actor } from "../../interfaces/actor";
import ActorDetail from "./ActorDetail";

const ActorList: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchActors = () => {
        setLoading(true);
        ActorService.getAllActors().then(setActors).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchActors();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Schauspieler wirklich löschen?")) {
            await ActorService.deleteActor(id);
            fetchActors();
        }
    };

    if (loading) return <div>Lade Schauspieler...</div>;

    if (selectedActorId)
        return (
            <ActorDetail
                actorId={selectedActorId}
                onBack={() => setSelectedActorId(null)}
            />
        );

    return (
        <div>
            <h2>Schauspieler</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>Geburtsjahr</th>
                    <th>Aktionen</th>
                </tr>
                </thead>
                <tbody>
                {actors.map(actor => (
                    <tr key={actor.actor_id}>
                        <td>{actor.actor_id}</td>
                        <td>{actor.first_name}</td>
                        <td>{actor.last_name}</td>
                        <td>{actor.birth_year ?? "-"}</td>
                        <td>
                            <button onClick={() => setSelectedActorId(actor.actor_id)}>
                                Details
                            </button>
                            <button onClick={() => handleDelete(actor.actor_id)}>
                                Löschen
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActorList;
