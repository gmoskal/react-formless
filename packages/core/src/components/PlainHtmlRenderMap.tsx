import * as React from "react"

import { toMap, replace, isEmpty } from "@react-formless/utils"
import {
    FormView,
    FormItemView,
    getElementsRenderMap,
    InputState,
    InputBoxRenderFn,
    InputOptionRenderFn,
    InputCollectionRenderFn,
    InputListRenderFn,
    InputRenderMap,
    InputBoxType,
    ElementsRenderMap,
    getInputProps,
    toFormState,
    toInputState
} from ".."

const Render: React.FC<{ condition: boolean; value: () => React.ReactElement }> = p => (p.condition ? p.value() : null)

const Title: React.FC<{ text?: string }> = p => <Render condition={!isEmpty(p.text)} value={() => <h3>{p.text}</h3>} />

type LabelProps = { text?: string } & Pick<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">
const Label: React.FC<LabelProps> = p => (
    <Render
        condition={!isEmpty(p.text)}
        value={() => (
            // eslint-disable-next-line jsx-a11y/label-has-for
            <label style={{ fontSize: "12px", color: "#777" }} htmlFor={p.htmlFor}>
                {p.text}
            </label>
        )}
    />
)

const Error: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)

const Input: InputBoxRenderFn = p => {
    const r = getElementsRenderMap(p.renderOptions)
    const inputProps = getInputProps(p)
    const type = p.schema.type === "number" ? "number" : p.schema.type === "password" ? "password" : "text"
    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} htmlFor={inputProps.id} />
            <input {...inputProps} type={type} />
            <r.Error {...p.state} />
        </>
    )
}

const TextAreaInput: InputBoxRenderFn<any> = p => {
    const r = getElementsRenderMap(p.renderOptions)

    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} />
            <textarea {...getInputProps<HTMLTextAreaElement>(p)} />
            <r.Error {...p.state} />
        </>
    )
}

const RadioInput: InputOptionRenderFn = p => {
    const r = getElementsRenderMap(p.renderOptions)
    const { onChange, ...inputProps } = getInputProps(p)
    const handleClick = (value: string) => () => (onChange ? onChange({ target: { value } } as any) : null)
    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} />
            {p.schema.values.map(([name, value]) => (
                <div key={value} onClick={handleClick(value)}>
                    <input
                        {...inputProps}
                        type="radio"
                        checked={`${p.state.value}` === `${value}`}
                        onChange={handleClick(value)}
                    />
                    <span>{name}</span>
                </div>
            ))}
        </>
    )
}

const SelectInput: InputOptionRenderFn = p => {
    const r = getElementsRenderMap(p.renderOptions)
    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} />
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

export const CollectionInput: InputCollectionRenderFn = p => {
    const r = getElementsRenderMap(p.renderOptions)
    const { mutate } = p.schema

    const onAddClick = () =>
        p.setDelta([...p.state, toFormState(p.schema.fields, () => (mutate ? mutate.createValue : null))])

    const onRemoveClick = (i: number) => () => p.setDelta(p.state.filter((_, i2) => i2 !== i))

    const getLabel = () =>
        mutate ? (p.state.length ? mutate.addNextLabel : mutate.addFirstLabel || mutate.addNextLabel) : ""

    if (!p.state.length)
        return (
            <>
                <r.Title text={p.schema.sectionTitle} />
                <r.Label text={p.schema.name} />
                {mutate && <r.Button onClick={onAddClick}>{getLabel()}</r.Button>}
            </>
        )

    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} />
            <r.ItemChildrenWrapper>
                {p.state.map((state, index) => (
                    <React.Fragment key={index}>
                        <FormView
                            schema={p.schema.fields}
                            state={state}
                            setState={d => p.setDelta(replace(p.state, index, d))}
                            {...p.renderOptions}
                        />
                        {mutate && p.state.length > 0 ? (
                            <r.Button onClick={onRemoveClick(index)}>{mutate.removeLabel || "Remove"}</r.Button>
                        ) : null}
                    </React.Fragment>
                ))}
                {mutate && <r.Button onClick={onAddClick}>{getLabel()}</r.Button>}
            </r.ItemChildrenWrapper>
        </>
    )
}

export const ListInput: InputListRenderFn = p => {
    const { mutate } = p.schema
    const r = getElementsRenderMap(p.renderOptions)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const onAdd = () => p.setDelta([...p.state, toInputState(p.schema.field, mutate!.createValue)])
    const onRemove = (i2: number) => () => p.setDelta(p.state.filter((_, i) => i2 !== i))
    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.ItemChildrenWrapper>
                {p.state.map((s, index) => (
                    <React.Fragment key={`${p.schema.type}-${index}`}>
                        <FormItemView
                            schema={p.schema.field}
                            state={s}
                            setDelta={value => p.setDelta(replace(p.state, index, value))}
                            renderOptions={p.renderOptions}
                        />
                        {mutate && p.state.length > 0 ? (
                            <r.Button onClick={onRemove(index)}>{mutate.removeLabel || "Remove"}</r.Button>
                        ) : null}
                    </React.Fragment>
                ))}
            </r.ItemChildrenWrapper>
            {mutate && <r.Button onClick={onAdd}>{mutate.addNextLabel}</r.Button>}
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

export const plainHtmlElementRenderMap: ElementsRenderMap = {
    ItemWrapper: p => <div {...p} />,
    Button: p => <button {...p} />,
    ItemChildrenWrapper: p => <div {...p} />,
    DefaultFormItem: () => <h1>Not supported</h1>,
    Title,
    Label,
    Error
}
