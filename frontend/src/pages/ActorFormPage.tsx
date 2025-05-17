// src/pages/ActorFormPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Actor } from "../types/types";
import { getActorById, createActor, updateActor } from "../services/ActorService";
import { TextField, Button, Paper, Box } from "@mui/material";

const defaultActor: Partial<Actor> = {
    first_name: "",
    last_name: ""
};

const ActorFormPage = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [actor, setActor] = useState<Partial<Actor>>(defaultActor);

    useEffect(() => {
        if (id && id !== "new") {
            getActorById(Number(id)).then((data) => {
                if (data) setActor(data);
            });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActor({ ...actor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && id !== "new") {
            await updateActor(Number(id), actor as Actor);
        } else {
            await createActor(actor as Actor);
        }
        navigate("/actor");
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto" }}>
            <h2>{id === "new" ? "Neuen Schauspieler anlegen" : "Schauspieler bearbeiten"}</h2>
            <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Vorname" name="first_name" value={actor.first_name} onChange={handleChange} required />
                <TextField label="Nachname" name="last_name" value={actor.last_name} onChange={handleChange} required />
                <Button type="submit" variant="contained">{id === "new" ? "Anlegen" : "Speichern"}</Button>
            </Box>
        </Paper>
    );
};

export default ActorFormPage;
