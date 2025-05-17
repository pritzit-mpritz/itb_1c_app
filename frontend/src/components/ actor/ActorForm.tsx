import React, { useState } from "react";
import { CreateActorDTO, Actor } from "../../interfaces/actor";
import ActorService from "../../api/ActorService";

interface ActorFormProps {
    /** Optional: Übergeben eines Actors zum Bearbeiten, sonst Anlegen */
    actor?: Actor;
    onSaved?: () => void; // Callback nach erfolgreichem Speichern
}

/**
 * Formular zum Erstellen/Bearbeiten eines Schauspielers.
 */
const ActorForm: React.FC<ActorFormProps> = ({ actor, onSaved }) => {
    const [form, setForm] = useState<CreateActorDTO>({
        first_name: actor?.first_name ?? "",
        last_name: actor?.last_name ?? "",
        birth_year: actor?.birth_year,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: name === "birth_year" ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (actor) {
                await ActorService.updateActor(actor.actor_id, form);
            } else {
                await ActorService.createActor(form);
            }
            onSaved?.();
            setForm({ first_name: "", last_name: "", birth_year: undefined });
        } catch (err) {
            setError("Fehler beim Speichern.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{actor ? "Schauspieler bearbeiten" : "Schauspieler anlegen"}</h3>
            <div>
                <label>Vorname: </label>
                <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Nachname: </label>
                <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Geburtsjahr: </label>
                <input
                    name="birth_year"
                    value={form.birth_year ?? ""}
                    type="number"
                    min={1900}
                    max={2100}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" disabled={loading}>
                {actor ? "Aktualisieren" : "Anlegen"}
            </button>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
    );
};

export default ActorForm;
