// noinspection JSUnusedLocalSymbols

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
    film_id: number;
    description: string;
    release_year: number;
    rental_duration: number;
    rental_rate: number;
    replacement_cost: number;
    special_features: string;
    title: string;
    length: string;
    rating: FilmRating | "";
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
    film_id: "0",
    title: "0",
    length: "0",
    description: "0",
    release_year: 0,
    rental_duration: 0,
    rental_rate: 0,
    replacement_cost: 0,
    rating: FilmRating.G,
    special_features: "Commentaries,Deleted Scenes,Behind the Scenes"
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
                        onChange={(e) =>
                            handleInputChanged("title", e.target.value)
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
                        onChange={(e) =>{
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("release_year", e.target.value)
                        }}
                    />

                    <TextField
                        label="Mietdauer"
                        variant="standard"
                        value={input.rental_duration}
                        onChange={(e) =>{
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("rental_duration", e.target.value)
                        }}
                    />

                    <TextField
                        label="Mietrate"
                        variant="standard"
                        value={input.rental_rate}
                        onChange={(e) =>{
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("rental_rate", e.target.value)
                        }}
                    />

                    <TextField
                        label="Wiederbeschaffungskosten"
                        variant="standard"
                        value={input.replacement_cost}
                        onChange={(e) =>{
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("replacement_cost", e.target.value)
                        }}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="rating-select-label">Rating</InputLabel>
                        <Select
                            labelId={"rating-select-label"}
                            id={"rating-select"}
                            value={input.rating}
                            label="Altersfreigabe"
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
                    <TextField
                        label="Aussergewöhnlliche Merkmale"
                        variant="standard"
                        value={input.special_features}
                        onChange={(e) =>
                            handleInputChanged("special_features", e.target.value)
                        }
                    />
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