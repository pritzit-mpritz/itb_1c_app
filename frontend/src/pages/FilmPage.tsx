// noinspection JSUnusedLocalSymbols



import axios from "axios";
import { Film } from "../interfaces/film";

/**
 * Erstellt einen neuen Film.
 */
export async function createFilm(film: Omit<Film, "film_id">): Promise<Film> {
    const res = await axios.post("http://localhost:3000/film", film);
    return res.data;
}

import React from "react";
import FilmForm from "../components/film/FilmForm";
// import FilmList usw. später für Übersicht

const FilmPage = () => (
    <div>
        <h2>Filme verwalten</h2>
        <FilmForm />
        {/* Später: <FilmList /> */}
    </div>
);

export default FilmPage;
// Später kannst du hier auch updateFilm, getAllFilms usw. ergänzen!
import { createFilm } from "../services/filmService";
import React, {useEffect} from 'react';
import {FormControl, InputLabel, Select, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import JsonView from "@uiw/react-json-view";
import MenuItem from "@mui/material/MenuItem";

export enum FilmRating {
    G = "G",
    PG = "PG",
    PG13 = "PG-13",
    R = "R",
    NC17 = "NC-17"
}


export interface InputType {
    film_id: string;
    title: string;
    description: string;
    release_year: string;
    rental_duration: string;
    rental_rate: string;
    length: string;
    rating: FilmRating | "";
    replacement_cost: string;
    special_features: string;
}

export type ValidationFieldset = {
    [key in keyof Partial<InputType>]: {
        validation?: {
            required?: boolean,
            minLength?: number,
            maxLength?: number,
            pattern?: RegExp,
        },
        message?: string,
        valid: boolean,
    };
};

const defaultInput: InputType = {
    film_id: "",
    title: "",
    length: "",
    rating: FilmRating.G,
    description: "",
    release_year: "",
    rental_duration: "3",
    rental_rate: "5.96",
    replacement_cost: "70",
    special_features: "",
}

const defaultValidation: ValidationFieldset = {
    title: {
        validation: {
            required: true,
            minLength: 3,
            maxLength: 100,
            pattern: /^[a-zA-Z0-9\s]+$/
        },
        message: "Titel muss zwischen 3 und 100 Zeichen lang sein.",
        valid: true
    },
    length: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 3,
        },
        message: "Bitte eine gültige Länge angeben.",
        valid: true
    },
    rating: {
        validation: {
            required: false,
        },
        valid: true
    }
}

const FilmPage = () => {
    const [input, setInput] = React.useState<InputType>(defaultInput)
    const [validation, setValidation] = React.useState<ValidationFieldset>(defaultValidation)

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

    /**
     * Validates the input form based on the specified validation rules for each field.
     * Updates the validation state with validation messages and status for each field.
     *
     * @return {boolean} Returns true if the form is valid, otherwise returns false.
     */
    function validateForm(): boolean {
        let formIsValid = true;

        Object.entries(input).forEach(([key, value]) => {
            const keyField = key as keyof InputType;
            const validationOptions: ValidationFieldset[keyof InputType] = validation[keyField];

            if (validationOptions?.validation) {
                if (validationOptions.validation.required && !value) {
                    validationOptions.valid = false;
                    validationOptions.message = "Bitte einen Wert angeben.";
                    formIsValid = false;
                } else if (validationOptions.validation.minLength && value && (value as string).length < validationOptions.validation.minLength) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit mindestens ${validationOptions.validation.minLength} Zeichen angeben.`;
                    formIsValid = false;
                } else if (validationOptions.validation.maxLength && value && (value as string).length > validationOptions.validation.maxLength) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit maximal ${validationOptions.validation.maxLength} Zeichen angeben.`;
                    formIsValid = false;
                } else if (validationOptions.validation.pattern && value && !(validationOptions.validation.pattern).test(value as string)) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit dem Muster ${validationOptions.validation.pattern} angeben.`;
                    formIsValid = false;
                }
                else {
                    validationOptions.valid = true;
                    validationOptions.message = "";
                }
            }

            setValidation((prevState) => ({
                ...prevState,
                [keyField]: {
                    ...validationOptions,
                    message: validationOptions?.message ?? "",
                    valid: validationOptions?.valid ?? false,
                }
            }));
        })

        return formIsValid;
    }

    function handleSaveClicked(): void {
        console.log("Save clicked", input);

        if (!validateForm()) {
            console.log("Validation failed");
            return;
        }

        const parsedInput = {...input, length: Number(input.length)};
        console.log("Parsed input", parsedInput);

        setValidation(defaultValidation);
    }

    return (
        <div>
            Film Page
            <Stack spacing={2} direction={"row"}>
                <Stack spacing={2} justifyContent="flex-start" direction="column" alignItems="flex-start">
                    <TextField
                        label="Titel"
                        variant="standard"
                        value={input.title}
                        error={!validation.title?.valid}
                        helperText={!validation.title?.valid && validation.title?.message}
                        onChange={(e) =>
                            handleInputChanged("title", e.target.value)
                        }
                    />

                    <TextField
                        label={"Länge (in Minuten)"}
                        variant="standard"
                        value={input.length}
                        error={!validation.length?.valid}
                        helperText={!validation.length?.valid && validation.length?.message}
                        onChange={(e) => {
                            if (!isNaN(Number(e.target.value)))
                                handleInputChanged("length", e.target.value)
                            }
                        }
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

                    <FormControl fullWidth>
                        <InputLabel id="rating-select-label">Rating</InputLabel>
                        <Select
                            labelId={"rating-select-label"}
                            id={"rating-select"}
                            value={input.rating}
                            label="Rating"
                            fullWidth
                            onChange={(e) => handleInputChanged("rating", e.target.value as FilmRating)}
                        >
                            <MenuItem value="">None</MenuItem>
                            {
                                Object.values(FilmRating).map((rating) => (
                                    <MenuItem value={rating}>{rating}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleSaveClicked}> Save</Button>
                </Stack>
                <JsonView value={input}/>
                <JsonView value={validation}/>
            </Stack>
        </div>
    )
        ;
};







export default FilmPage;