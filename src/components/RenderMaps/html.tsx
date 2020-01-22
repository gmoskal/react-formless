import * as React from "react"
import { InputProps, getInputProps } from "../../forms"
import { InputRenderMap } from "../FormView"

const ErrorLabel: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)

export const renderBasicInput = (p: InputProps<any>) => (
    <>
        {p.schema.sectionTitle ? <h1>{p.schema.sectionTitle}</h1> : null}
        <div className="InputWrapper">
            <p>{p.schema.name}</p>
            <input {...getInputProps(p)} type={p.schema.type === "number" ? "text" : p.schema.type} />
            <ErrorLabel {...p.state} />
        </div>
    </>
)

export const htmlRenderMap: Partial<InputRenderMap> = {
    email: renderBasicInput,
    password: renderBasicInput,
    text: renderBasicInput
}
