import * as React from "react"
import { getInputProps, toFormState, toInputState } from "../forms"
import { toMap, replace } from "../utils/map"
import { FormView, InputView } from "./FormView"

const Title: React.FC<{ text?: string }> = p => (p.text ? <h3>{p.text}</h3> : null)
const Label: React.FC<{ text?: string }> = p =>
    p.text ? <div style={{ fontSize: "12px", color: "#777" }}>{p.text}</div> : null

const Error: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)

const Input: InputBoxRenderFn = p => (
    <>
        <Title text={p.schema.sectionTitle} />
        <div style={{ padding: "5px 0" }}>
            <Label text={p.schema.name} />
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

const RadioInput: InputOptionRenderFn = p => {
    const { onChange, ...inputProps } = getInputProps(p)
    const handleClick = (value: string) => () => (onChange ? onChange({ target: { value } } as any) : null)
    return (
        <>
            <Title text={p.schema.sectionTitle} />
            <Label text={p.schema.name} />
            {p.schema.values.map(([name, value]) => {
                return (
                    <div key={value} onClick={handleClick(value)}>
                        <input {...inputProps} value={value} type="radio" checked={`${p.state.value}` === `${value}`} />
                        <span>{name}</span>
                    </div>
                )
            })}
        </>
    )
}

const SelectInput: InputOptionRenderFn = p => (
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

export const CollectionInput: InputCollectionRenderFn = p => {
    const { mutate } = p.schema

    const onAddClick = () =>
        p.setDelta([...p.state, toFormState(p.schema.fields, () => (mutate ? mutate.createValue : null))])

    const onRemoveClick = (i: number) => () => p.setDelta(p.state.filter((_, i2) => i2 !== i))

    const getLabel = () => {
        if (!mutate) return ""
        return p.state.length ? mutate.addNextLabel : mutate.addFirstLabel || mutate.addNextLabel
    }

    if (!p.state.length)
        return (
            <div>
                <Label text={p.schema.sectionTitle} />
                {mutate && <button onClick={onAddClick}>{getLabel()}</button>}
            </div>
        )

    return (
        <>
            <Label text={p.schema.sectionTitle} />
            {p.state.map((state, index) => (
                <div key={index}>
                    <FormView
                        schema={p.schema.fields}
                        state={state}
                        setState={d => p.setDelta(replace(p.state, index, d))}
                    />
                    {mutate && p.state.length > 0 ? (
                        <button onClick={onRemoveClick(index)}>{mutate.removeLabel || "Remove"}</button>
                    ) : null}
                </div>
            ))}
            {mutate && <button onClick={onAddClick}>{getLabel()}</button>}
        </>
    )
}

export const ListInput: InputListRenderFn = p => {
    const { mutate } = p.schema
    const onAdd = () => p.setDelta([...p.state, toInputState(p.schema.field, mutate!.createValue)])
    const onRemove = (i: number) => () => p.setDelta(p.state.filter((_, i) => i !== i))
    return (
        <>
            <Title text={p.schema.sectionTitle} />
            {p.state.map((s, index) => (
                <React.Fragment key={`${p.schema.type}-${index}`}>
                    <InputView
                        schema={p.schema.field}
                        state={s}
                        setDelta={value => p.setDelta(replace(p.state, index, value))}
                        extra={p.extra}
                    />
                    {mutate && p.state.length > 0 ? (
                        <button onClick={onRemove(index)}>{mutate.removeLabel || "Remove"}</button>
                    ) : null}
                </React.Fragment>
            ))}
            {mutate && <button onClick={onAdd}>{mutate.addNextLabel}</button>}
        </>
    )
}

export const plainHtmlRenderMap: Partial<InputRenderMap> = {
    ...toMap<InputBoxType, InputBoxRenderFn>(
        ["text", "email", "password", "number", "customBox"],
        k => k,
        () => Input
    ),
    textarea: TextAreaInput,
    radio: RadioInput,
    select: SelectInput,
    collection: CollectionInput,
    list: ListInput
}
