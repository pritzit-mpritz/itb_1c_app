// src/pages/ActorDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Actor } from "../types/types";
import { getActorById, deleteActor } from "../services/ActorService";
import JsonView from "@uiw/react-json-view";
import { Button, Paper } from "@mui/material";

const ActorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [actor, setActor] = useState<Actor | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getActorById(Number(id)).then(setActor);
        }
    }, [id]);

    const handleDelete = async () => {
        if (id) {
            await deleteActor(Number(id));
            navigate("/actor");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
            <h2>Schauspieler-Details</h2>
            {actor ? (
                <>
                    <JsonView value={actor} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/actor/${id}/edit`)}
                        sx={{ mt: 2, mr: 2 }}
                    >
                        Bearbeiten
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ mt: 2 }}
                    >
                        Löschen
                    </Button>
                </>
            ) : (
                "Lade Daten..."
            )}
        </Paper>
    );
};

export default ActorDetailPage;
