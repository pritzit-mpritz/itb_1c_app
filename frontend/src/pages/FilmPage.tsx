// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import JsonView from "@uiw/react-json-view";

export interface InputType {
    title: string;
    length: string;
}

const defaultInput: InputType = {
    title: "",
    length: "0"
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
                    <Button variant="contained" onClick={handleSaveClicked}> Save</Button>
                </Stack>
                <JsonView value={input}/>
            </Stack>
        </div>
    )
        ;
};

export default FilmPage;