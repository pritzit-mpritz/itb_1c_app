import React, { useState } from "react";
import { Film } from "../../interfaces/film";
import { createFilm } from "../../api/FilmService";
import { Stack, TextField, Button } from "@mui/material";

/**
 * Props für das FilmForm, optional mit "onSaved"-Callback
 */
interface FilmFormProps {
    onSaved?: () => void;
}

const defaultInput: Omit<Film, "film_id"> = {
    title: "",
    description: "",
    release_year: "",
    rental_duration: "",
    rental_rate: "",
    length: "",
    rating: "",
    replacement_cost: "",
    special_features: "",
};

const FilmForm: React.FC<FilmFormProps> = ({ onSaved }) => {
    const [input, setInput] = useState<Omit<Film, "film_id">>(defaultInput);

    /**
     * Behandelt Änderungen in jedem Input-Feld.
     */
    function handleInputChanged(key: keyof Omit<Film, "film_id">, value: string) {
        setInput({
            ...input,
            [key]: value,
        });
    }

    /**
     * Sendet den Film an die API.
     */
    async function handleSaveClicked() {
        try {
            await createFilm(input);
            setInput(defaultInput); // Reset
            if (onSaved) onSaved();
            alert("Film gespeichert!");
        } catch (err) {
            alert("Fehler beim Speichern");
            console.error(err);
        }
    }

    return (
        <Stack spacing={2}>
            <TextField
                label="Titel"
                value={input.title}
                onChange={(e) => handleInputChanged("title", e.target.value)}
            />
            <TextField
                label="Beschreibung"
                value={input.description}
                onChange={(e) => handleInputChanged("description", e.target.value)}
            />
            <TextField
                label="Release Jahr"
                value={input.release_year}
                onChange={(e) => handleInputChanged("release_year", e.target.value)}
            />
            {/* Weitere Felder nach Bedarf... */}
            <Button variant="contained" onClick={handleSaveClicked}>Speichern</Button>
            <Button variant="outlined" onClick={() => setInput(defaultInput)}>
                Zurücksetzen
            </Button>
        </Stack>
    );
};

export default FilmForm;