mport React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFilmById, addActorToFilm, removeActorFromFilm } from "../../api/FilmService";
import { Film, Actor } from "../../interfaces/film";
import { Stack, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

/**
 * Zeigt die Detailseite eines Films inkl. Schauspielern
 */
const FilmDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<Film | null>(null);

    useEffect(() => {
        if (id) {
            getFilmById(id).then(setFilm);
        }
    }, [id]);

    if (!film) return <div>Lädt...</div>;

    return (
        <div>
            <Typography variant="h5">{film.title}</Typography>
            <Typography variant="body1">Jahr: {film.release_year}</Typography>
            <Typography variant="body1">Beschreibung: {film.description}</Typography>
            {/* Weitere Felder nach Bedarf... */}

            <Typography variant="h6" sx={{ mt: 2 }}>Schauspieler:</Typography>
            <List>
                {film.actors && film.actors.length > 0 ? (
                    film.actors.map((actor) => (
                        <ListItem
                            key={actor.actor_id}
                            secondaryAction={
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={async () => {
                                        await removeActorFromFilm(film.film_id!.toString(), actor.actor_id.toString());
                                        // Nach dem Entfernen neu laden!
                                        const updated = await getFilmById(id!);
                                        setFilm(updated);
                                    }}
                                >
                                    Entfernen
                                </Button>
                            }
                        >
                            <ListItemText primary={`${actor.first_name} ${actor.last_name}`} />
                        </ListItem>
                    ))
                ) : (
                    <ListItem>
                        <ListItemText primary="Keine Schauspieler verknüpft." />
                    </ListItem>
                )}
            </List>
            {/* TODO: Komponente oder Select zum Hinzufügen von Schauspielern einbauen */}
        </div>
    );
};

export default FilmDetail;