import * as React from "react"
import { getInputProps } from "../forms"
import { toMap } from "../utils/map"

const Title: React.FC<{ text?: string }> = p => (p.text ? <h1>{p.text}</h1> : null)
const Label: React.FC<{ text?: string }> = p => (p.text ? <p>{p.text}</p> : null)
const Error: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)
const BasicInput: InputBoxRenderFn = p => (
    <>
        <Title text={p.schema.sectionTitle} />
        <div className="InputWrapper">
            <p>{p.schema.name}</p>
            <input
                {...getInputProps(p)}
                type={p.schema.type === "number" ? "number" : p.schema.type === "password" ? "password" : "text"}
            />
            <Error {...p.state} />
        </div>
    </>
)

const TextAreaInput: InputBoxRenderFn<any> = p => (
    <>
        <Title text={p.schema.sectionTitle} />
        <div className="InputWrapper">
            <p>{p.schema.name}</p>
            <textarea {...getInputProps<HTMLTextAreaElement>(p)} />
            <Error {...p.state} />
        </div>
    </>
)

const RadioInput: InputOptionRenderFn = p => (
    <>
        <Title text={p.schema.sectionTitle} />
        <Label text={p.schema.name} />
        {p.schema.values.map(([name, value]) => {
            const { onChange, ...inputProps } = getInputProps(p)
            return (
                <div key={value} onClick={() => (onChange ? onChange({ target: { value } } as any) : null)}>
                    <input {...inputProps} value={value} type="radio" checked={`${p.state.value}` === `${value}`} />
                    <span>{name}</span>
                </div>
            )
        })}
    </>
)

const SelectInput: InputOptionRenderFn = p => {
    return (
        <>
            <Title text={p.schema.sectionTitle} />
            <Label text={p.schema.name} />
            <select name={p.schema.name} {...getInputProps<HTMLSelectElement>(p)}>
                {p.schema.values.map(([name, value]) => (
                    <option value={value} key={value}>
                        {name}
                    </option>
                ))}
            </select>
        </>
    )
}

export const plainHtmlRenderMap: Partial<InputRenderMap> = {
    ...toMap<InputBoxType, InputBoxRenderFn>(
        ["text", "email", "password", "number", "customBox"],
        k => k,
        () => BasicInput
    ),
    textarea: TextAreaInput,
    radio: RadioInput,
    select: SelectInput
}
