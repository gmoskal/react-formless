import * as React from "react"
import { getInputProps } from "../../forms"

const ErrorLabel: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)

export const renderBasicInput: InputBoxRenderFn<any> = p => (
    <>
        {p.schema.sectionTitle ? <h1>{p.schema.sectionTitle}</h1> : null}
        <div className="InputWrapper">
            <p>{p.schema.name}</p>
            <input {...getInputProps(p)} type={p.schema.type === "number" ? "text" : p.schema.type} />
            <ErrorLabel {...p.state} />
        </div>
    </>
)

export const Title: React.FC<{ text?: string }> = p => (p.text ? <h1>{p.text}</h1> : null)
export const Label: React.FC<{ text?: string }> = p => (p.text ? <p>{p.text}</p> : null)

export const RadioInput: InputOptionRenderFn = p => (
    <>
        <Title text={p.schema.sectionTitle} />
        <Label text={p.schema.name} />
        {p.schema.values.map(([name, value]) => {
            const inputProps = getInputProps(p)
            return (
                <div key={value} {...inputProps}>
                    <input {...inputProps} value={value} type="radio" checked={`${p.state.value}` === `${value}`} />
                    <span>{name}</span>
                </div>
            )
        })}
    </>
)

export const plainHtmlRenderMap: Partial<InputRenderMap> = {
    email: renderBasicInput,
    password: renderBasicInput,
    text: renderBasicInput,
    radio: RadioInput
}
