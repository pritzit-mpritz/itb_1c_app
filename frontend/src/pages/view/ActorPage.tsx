// noinspection JSUnusedLocalSymbols
    import React, {useEffect} from 'react';
    import {/*FormControl, InputLabel, Select,*/ Stack, TextField} from "@mui/material";
    import Button from "@mui/material/Button";
    import JsonView from "@uiw/react-json-view";
    //import MenuItem from "@mui/material/MenuItem";




    export interface InputType {
        actor_id: string;
        first_name: string;
        last_name: string;
        last_update: string;
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
        actor_id: "0",
        first_name: "John",
        last_name: "Doe",
        last_update: "01.01.2000",
    }

    const defaultValidation: ValidationFieldset = {
        first_name: {
            validation: {
                required: true,
                minLength: 3,
                maxLength: 100,
                pattern: /^[a-zA-Z0-9\s]+$/
            },
            message: "Titel muss zwischen 3 und 100 Zeichen lang sein.",
            valid: true
        },
        last_name: {
            validation: {
                required: true,
                minLength: 1,
                maxLength: 3,
            },
            message: "Bitte eine gültige Länge angeben.",
            valid: true
        },
        last_update: {
            validation: {
                required: false,
            },
            valid: true
        }
    }
const ActorPage = () => {
    const [input, setInput] = React.useState<InputType>(defaultInput)
    const [validation, setValidation] = React.useState<ValidationFieldset>(defaultValidation)

    useEffect(() => {
        console.log("Actor Page mounted")
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

            const parsedInput = {...input, last_update: Number(input.last_update)};
            console.log("Parsed input", parsedInput);

            setValidation(defaultValidation);
        }

        return (
            <div>
                Actor Page
                <Stack spacing={2} direction={"row"}>
                    <Stack spacing={2} justifyContent="flex-start" direction="column" alignItems="flex-start">
                        <TextField
                            label="Schauspieler Vorname"
                            variant="standard"
                            value={input.first_name}
                            onChange={(e) =>
                                handleInputChanged("first_name", e.target.value)
                            }
                        />
                        <TextField
                            label="Schauspieler Nachname"
                            variant="standard"
                            value={input.last_name}
                            onChange={(e) =>
                                handleInputChanged("last_name", e.target.value)
                            }
                        />
                        <TextField
                            label={"Letztes Update"}
                            variant="standard"
                            value={input.last_update}
                            onChange={(e) => {
                                if(!isNaN(Number(e.target.value)))
                                    handleInputChanged("last_update", e.target.value)
                            }}
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


export default ActorPage;