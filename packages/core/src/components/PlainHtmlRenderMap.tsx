import * as React from "react"

import { replace, isEmpty, isFunction } from "@react-formless/utils"
import { css, default as styled } from "styled-components"
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
    ElementsRenderMap,
    getInputProps,
    toFormState,
    toInputState,
    StyledInputsRenderMap
} from ".."

const Render: React.FC<{ condition: boolean; value: () => React.ReactElement }> = p => (p.condition ? p.value() : null)

const StyledTitle = styled.h3`
    color: #666;
    padding: 0;
    margin: 6px 0;
`
const Title: React.FC<{ text?: string }> = p => (
    <Render condition={!isEmpty(p.text)} value={() => <StyledTitle>{p.text}</StyledTitle>} />
)

type LabelProps = { text?: string } & Pick<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">

const StyledLabel = styled.label`
    font-size: 0.8rem;
    color: #666;
`
const Label: React.FC<LabelProps> = p => (
    <Render
        condition={!isEmpty(p.text)}
        // eslint-disable-next-line jsx-a11y/label-has-for
        value={() => <StyledLabel htmlFor={p.htmlFor}>{p.text}</StyledLabel>}
    />
)

const StyledError = styled.div`
    color: #f88;
`
const Error: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <StyledError>
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </StyledError>
)

const sharedStyle = css`
    width: 100%;
    color: rgba(0, 0, 0, 0.87);
    overflow-wrap: break-word;
    outline: none;
    display: flex;
    line-height: 34px;
    font-size: 16px;
    border: 1px solid rgb(223, 225, 229);
    padding: 0px 6px;
    margin: 0px 0px 4px;
    box-sizing: border-box;
    &::placeholder {
        color: #ccc;
    }
`
const StyledInput = styled.input`
    ${sharedStyle}
`

const Input: InputBoxRenderFn = p => {
    const r = getElementsRenderMap(p.renderOptions)
    const inputProps = getInputProps(p)
    const type = p.schema.type === "number" ? "number" : p.schema.type === "password" ? "password" : "text"
    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} htmlFor={inputProps.id} />
            <StyledInput {...inputProps} type={type} />
            <r.Error {...p.state} />
        </>
    )
}

export const StyledTextArea = styled.textarea`
    ${sharedStyle}
`
const TextAreaInput: InputBoxRenderFn<any> = p => {
    const r = getElementsRenderMap(p.renderOptions)

    return (
        <>
            <r.Title text={p.schema.sectionTitle} />
            <r.Label text={p.schema.name} />
            <StyledTextArea {...getInputProps<HTMLTextAreaElement>(p)} />
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
    const mutate = p.schema.mutate

    const onAddClick = () =>
        p.setDelta([
            ...p.state,
            toFormState(
                p.schema.fields,
                mutate ? (isFunction(mutate.createValue) ? mutate.createValue() : mutate.createValue) : null
            )
        ])

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
export const plainHtmlRenderMap: InputRenderMap = {
    text: Input,
    password: Input,
    number: Input,
    customBox: Input,
    email: Input,
    textarea: TextAreaInput,
    hidden: () => null,
    radio: RadioInput,
    select: SelectInput,
    customOption: SelectInput,
    multiselect: () => null,
    collection: CollectionInput,
    list: ListInput
}
const Button = styled.button`
    background-image: -webkit-linear-gradient(top, rgb(245, 245, 245), rgb(241, 241, 241));
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(242, 242, 242);
    border-radius: 4px;
    color: rgb(95, 99, 104);
    font-size: 14px;
    margin: 4px;
    padding: 0px 14px;
    line-height: 27px;
    height: 36px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    min-width: 90px;
`
const ItemWrapper = styled.div`
    margin: 2px;
`
export const plainHtmlElementRenderMap: ElementsRenderMap = {
    ItemWrapper,
    Button,
    ItemChildrenWrapper: p => <div {...p} />,
    DefaultFormItem: () => <h1>Not supported</h1>,
    Title,
    Label,
    Error
}

export const Row = styled.div`
    display: flex;
    box-sizing: border-box;

    flex-direction: row;
    & > div {
        flex: 1;
        & > input {
            width: calc(100% - 12px);
        }
    }
    & > div:last-child > input {
        width: 100%;
    }
`

export const styledInputsRenderMap: StyledInputsRenderMap = {
    Title: p => <StyledTitle>{p.value}</StyledTitle>,
    Row: p => <Row>{p.value}</Row>,
    Custom: () => <pre>Implement me</pre>
}
