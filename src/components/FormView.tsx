import * as React from "react"
import { InputProps, getInputProps } from "../forms"
import { toArray } from "../utils/map"

const ErrorLabel: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)

export const BasicInput: React.FC<InputProps<any>> = p => (
    <>
        {p.schema.sectionTitle ? <h1>{p.schema.sectionTitle}</h1> : null}
        <div className="InputWrapper">
            <p>{p.schema.name}</p>
            <input {...getInputProps(p)} type={p.schema.type === "number" ? "text" : p.schema.type} />
            <ErrorLabel {...p.state} />
        </div>
    </>
)

type FormInputProps<T> = { schema: InputSchema<T>; state: any; setDelta: F1<any> }
export const FormInput = <T extends any>({ schema, ...p }: FormInputProps<T>): React.ReactElement => {
    switch (schema.type) {
        case "text":
        case "email":
        case "number":
        case "password":
            return <BasicInput {...p} schema={schema} />
        default:
            return <pre>{JSON.stringify(p)}</pre>

        // case "textarea":
        //     return <TextAreaInput {...p} schema={schema} />

        // case "collection":
        //     return <CollectionInput {...p} schema={schema} />

        // case "list":
        //     return <ListInput {...p} schema={schema} />

        // case "radio":
        //     return <RadioInput {...p} schema={schema} />

        // case "chips":
        //     return <CreatableChipsInput {...p} schema={schema} />

        // case "dropdown":
        //     return <DropdownInput {...p} schema={schema} />

        // case "selectableChips":
        //     return <ChipsInput {...p} schema={schema} />
    }
}

export type FormViewProps<T> = {
    setState: F1<FormState<T>>
    state: FormState<T>
    schema: FormSchema<T>
    columns?: number
}

export function FormView<T extends any>(p: FormViewProps<T>): React.ReactElement {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    return (
        <>
            {toArray(p.schema, (schema, key) => ({ schema, key, state: p.state[key] as any })).map(s => (
                <FormInput {...s} setDelta={setDelta(s.key)} />
            ))}
        </>
    )
}
