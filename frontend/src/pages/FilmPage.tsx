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
    film_id: string;
    title: string;
    description: string;
    release_year: string;
    rental_duration: string;
    rental_rate: string;
    length: string;
    replacement_cost: string;
    special_features: string;
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
    film_id: "",
    title: "",
    description: "",
    release_year: "",
    rental_duration: "",
    rental_rate: "",
    length: "",
    replacement_cost: "",
    special_features: "",
    rating: FilmRating.G
}

const defaultValidation: ValidationFieldset = {
    film_id: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 20,
        },
        message: "ID muss zwischen 1 und 20 Zeichen lang sein.",
        valid: true
    },
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
    description: {
        validation: {
            required: true,
            minLength: 10,
            maxLength: 500,
            pattern: /^[a-zA-Z0-9\s]+$/,
        },
        message: "Beschreibung muss zwischen 10 und 500 Zeichen lang sein.",
        valid: true
    },
    release_year: {
        validation: {
            required: false,
            minLength: 4,
            maxLength: 4,
            pattern: /^[0-9]{4}$/,
        },
        message: "Bitte ein gültiges ErscheinungsJahr angeben. (z.B. 2021)",
        valid: true
    },
    rental_duration: {
        validation:{
            required: false,
            minLength: 1,
            maxLength: 1,
            pattern: /^[0-9]$/,
        },
        message: "Bitte eine gültige Mietdauer angeben. (z.B. 7)",
        valid: true
    },
    rental_rate: {
        validation:{
            required: false,
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/, //das habe ich einfach kopiert. ich bin nicht sicher..
        },
        message: "Bitte eine gültige Rate angeben. (z.B. 3.50)",
        valid: true
    },
    length: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 3,
            pattern: /^[0-9]+$/,
        },
        message: "Bitte eine gültige Länge angeben. (z.B. 120)",
        valid: true
    },
    rating: {
        validation: {
            required: false,
        },
        valid: true
    },
    replacement_cost: {
        validation:{
            required: false,
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/ //auch kopiert.

        },
        message: "Bitte gültige Ersatzkosten angeben. (z.B. 10.00)",
        valid: true
    },
    special_features: {
        validation: {
            required: false,
            minLength: 10,
            maxLength: 100,
        },
        message: "Eigenschaften müssen zwischen 10 und 100 Zeichen lang sein.",
        valid: true
    },

};

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

        const parsedInput = {...input,
            length: Number(input.length),
            release_year: Number(input.release_year),
            rental_duration: Number(input.rental_duration),
            rental_rate: Number(input.rental_rate),
            replacement_cost: Number(input.replacement_cost),
        };
        console.log("Parsed input", parsedInput);

        setValidation(defaultValidation);
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
                        error={!validation.film_id?.valid}
                        helperText={!validation.film_id?.valid && validation.film_id?.message}
                        onChange={(e) =>
                            handleInputChanged("film_id", e.target.value)
                        }
                    />

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
                        label="Beschreibung"
                        variant="standard"
                        value={input.description}
                        error={!validation.description?.valid}
                        helperText={!validation.description?.valid && validation.description?.message}
                        onChange={(e) =>
                            handleInputChanged("description", e.target.value)
                        }
                    />

                    <TextField
                        label="Erscheinungsjahr"
                        variant="standard"
                        value={input.release_year}
                        error={!validation.release_year?.valid}
                        helperText={!validation.release_year?.valid && validation.release_year?.message}
                        onChange={(e) => {
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("release_year", e.target.value)
                        }}
                    />

                    <TextField
                        label="Mietdauer"
                        variant="standard"
                        value={input.rental_duration}
                        error={!validation.rental_duration?.valid}
                        helperText={!validation.rental_duration?.valid && validation.rental_duration?.message}
                        onChange={(e) => {
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("rental_duration", e.target.value)
                        }}
                    />

                    <TextField
                        label="Rate (in CHF)"
                        variant="standard"
                        value={input.rental_rate}
                        error={!validation.rental_rate?.valid}
                        helperText={!validation.rental_rate?.valid && validation.rental_rate?.message}
                        onChange={(e) => {
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("rental_rate", e.target.value)
                        }}
                    />

                    <TextField
                        label="Länge (in Minuten)"
                        variant="standard"
                        value={input.length}
                        error={!validation.length?.valid}
                        helperText={!validation.length?.valid && validation.length?.message}
                        onChange={(e) => {
                            if (!isNaN(Number(e.target.value)))
                                handleInputChanged("length", e.target.value)
                        }}
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


                    <TextField
                        label="Ersatzkosten (in CHF)"
                        variant="standard"
                        value={input.replacement_cost}
                        error={!validation.replacement_cost?.valid}
                        helperText={!validation.replacement_cost?.valid && validation.replacement_cost?.message}
                        onChange={(e) => {
                            if(!isNaN(Number(e.target.value)))
                                handleInputChanged("replacement_cost", e.target.value)
                        }}
                    />

                    <TextField
                        label="Eigenschaften"
                        variant="standard"
                        value={input.special_features}
                        error={!validation.special_features?.valid}
                        helperText={!validation.special_features?.valid && validation.special_features?.message}
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
    );
};

export default FilmPage;