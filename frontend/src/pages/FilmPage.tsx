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
    film_id: "",
    title: "",
    description: "",
    release_year: "",
    rental_duration: "3 weeks",
    rental_rate: "5.96 CHF",
    length: "",
    replacement_cost: "70 CHF",
    rating: "",
    special_features: "",
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
            FilmPage
            <Stack spacing={2} direction="row">
                {/* First column */}
                <Stack spacing={2} direction="column" alignItems="flex-start">
                    <TextField
                        label="Film ID"
                        variant="standard"
                        value={input.film_id}
                        onChange={(e) => handleInputChanged("film_id", e.target.value)}
                    />
                    <TextField
                        label="Titel"
                        variant="standard"
                        value={input.title}
                        onChange={(e) => handleInputChanged("title", e.target.value)}
                    />
                    <TextField
                        label="Beschreibung"
                        variant="standard"
                        value={input.description}
                        onChange={(e) => handleInputChanged("description", e.target.value)}
                    />
                    <TextField
                        label="Länge (in Minuten)"
                        variant="standard"
                        value={input.length}
                        onChange={(e) => {
                            if (!isNaN(Number(e.target.value))) {
                                handleInputChanged("length", e.target.value)
                            }
                        }}
                    />
                    <TextField
                        label="Release Jahr"
                        variant="standard"
                        value={input.release_year}
                        onChange={(e) => handleInputChanged("release_year", e.target.value)}
                    />
                </Stack>

                {/* Second column */}
                <Stack spacing={2} direction="column" alignItems="flex-start">
                    <TextField
                        label="Rental Duration"
                        variant="standard"
                        value={input.rental_duration}
                        onChange={(e) => handleInputChanged("rental_duration", e.target.value)}
                    />
                    <TextField
                        label="Rental Rate"
                        variant="standard"
                        value={input.rental_rate}
                        onChange={(e) => handleInputChanged("rental_rate", e.target.value)}
                    />
                    <TextField
                        label="Replacement Cost"
                        variant="standard"
                        value={input.replacement_cost}
                        onChange={(e) => handleInputChanged("replacement_cost", e.target.value)}
                    />
                    <TextField
                        label="Rating"
                        variant="standard"
                        value={input.rating}
                        onChange={(e) => handleInputChanged("rating", e.target.value)}
                    />
                    <TextField
                        label="Special Features"
                        variant="standard"
                        value={input.special_features}
                        onChange={(e) => handleInputChanged("special_features", e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSaveClicked}>Save</Button>
                </Stack>
                <JsonView value={input}/>
            </Stack>
        </div>
    )
        ;
};

export default FilmPage;