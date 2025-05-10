// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import JsonView from "@uiw/react-json-view";

export interface InputType {
    film_id: string;
    title: string;
    description: string;
    release_year: string;
    rental_duration: string;
    rental_rate: string;
    length: string;
    replacement_cost: string;
    rating: string;
    special_features: string;
}

const defaultInput: InputType = {
    film_id: "0",
    title: "",
    description: "",
    release_year: "2015",
    rental_duration: "5",
    rental_rate: "0",
    length: "120",
    replacement_cost: "0",
    rating: "0",
    special_features: "0",
}

const FilmPage = () => {
    const [input, setInput] = React.useState<InputType>(defaultInput)

    useEffect(() => {
        console.log("Film Page mounted")
    }, [])

    function handleInputChanged(key: keyof InputType, value: unknown) {
        setInput({
                ...input,
                [key]: value
            }
        );
    }

    function handleSaveClicked(): void {
        console.log("Save clicked", input);
        const parsedInput = {...input, length: Number(input.length)};
        console.log("Parsed input", parsedInput);
    }

    return (
        <div>
            Film Page
            <Stack spacing={2} direction={"row"}>
                <Stack spacing={2} justifyContent="flex-start" direction="column" alignItems="flex-start">

                    <TextField
                        label="Film ID"
                        variant="standard"
                        value={input.film_id}
                        onChange={(e) =>
                            handleInputChanged("film_id", e.target.value)
                        }
                    />

                    <TextField
                        label="Titel"
                        variant="standard"
                        value={input.title}
                        onChange={(e) =>
                            handleInputChanged("title", e.target.value)
                        }
                    />

                    <TextField
                        label="Beschreibung"
                        variant="standard"
                        value={input.description}
                        onChange={(e) =>
                            handleInputChanged("description", e.target.value)
                        }
                    />

                    <TextField
                        label="Erscheinungsjahr"
                        variant="standard"
                        value={input.release_year}
                        onChange={(e) =>
                            handleInputChanged("release_year", e.target.value)
                        }
                    />

                    <TextField
                        label="Mietdauer"
                        variant="standard"
                        value={input.rental_duration}
                        onChange={(e) =>
                            handleInputChanged("rental_duration", e.target.value)
                        }
                    />

                    <TextField
                        label="Mietpreis"
                        variant="standard"
                        value={input.rental_rate}
                        onChange={(e) =>
                            handleInputChanged("rental_rate", e.target.value)
                        }
                    />

                    <TextField
                        label={"Länge (in Minuten)"}
                        variant="standard"
                        value={input.length}
                        onChange={(e) => {
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("length", e.target.value)
                        }}

                    />

                    <TextField
                        label="Ersatzkosten"
                        variant="standard"
                        value={input.replacement_cost}
                        onChange={(e) =>
                            handleInputChanged("replacement_cost", e.target.value)
                        }
                    />

                    <TextField
                        label="Bewertung"
                        variant="standard"
                        value={input.rating}
                        onChange={(e) =>
                            handleInputChanged("rating", e.target.value)
                        }
                    />

                    <TextField
                        label="Besondere Merkmale"
                        variant="standard"
                        value={input.special_features}
                        onChange={(e) =>
                            handleInputChanged("special_features", e.target.value)
                        }
                    />


                    <Button variant="contained" onClick={handleSaveClicked}> Save</Button>
                </Stack>
                <JsonView value={input}/>
            </Stack>
        </div>
    )
        ;
};

export default FilmPage;