import * as React from "react"

import { toMap, replace } from "@formless/core/src/utils/map"

import {
    InputBoxRenderFn,
    InputOptionRenderFn,
    InputCollectionRenderFn,
    FormView,
    InputRenderMap,
    InputBoxType,
    InputOptionType
} from "@formless/core"

type CSS = React.CSSProperties

const inputStyle: CSS = { border: "1px solid #ddd", borderRadius: 5, background: "#eee", padding: 5, minHeight: 19 }
const labelStyle: CSS = {
    display: "block",
    float: "left",
    borderRight: "1px solid #d0d0d0",
    paddingRight: 8,
    marginRight: 7,
    color: "#999",
    fontSize: 14
}

const lengthStyle: CSS = {
    display: "block",
    float: "right",
    borderLeft: "1px solid #d0d0d0",
    paddingLeft: 8,
    color: "#aaa",
    fontSize: 12,
    minWidth: 58,
    marginTop: 2
}

export const ReadonlyInputWithLength: InputBoxRenderFn<any> = p => (
    <>
        <h4 style={inputStyle}>
            <span style={labelStyle}>{p.schema.name}</span>
            {p.state.value || p.schema.placeholder || ""}
            <span style={lengthStyle}>{`length: ${p.state.value?.length || 0}`}</span>
        </h4>
    </>
)

const styleBase: React.CSSProperties = { border: "2px solid red", padding: 5, margin: 5, borderRadius: 5 }
export const ReadonlySelectInput: InputOptionRenderFn = p => (
    <>
        {p.schema.values.map(([name, value]) => (
            <span style={{ ...styleBase, borderColor: p.state.value === value ? "#29f" : "#ddd" }} key={value}>
                {name}
            </span>
        ))}
    </>
)

export const ReadonlyCollectionInput: InputCollectionRenderFn = p => {
    if (!p.state.length) return <h3>Empty {p.schema.sectionTitle}</h3>

    return (
        <>
            <p>{p.schema.sectionTitle}</p>
            {p.state.map((state, index) => (
                <div key={index}>
                    <FormView
                        schema={p.schema.fields}
                        state={state}
                        setState={d => p.setDelta(replace(p.state, index, d))}
                        {...p.renderOptions}
                    />
                </div>
            ))}
        </>
    )
}
export const readOnlyRenderMap: Partial<InputRenderMap> = {
    ...toMap<InputBoxType, InputBoxRenderFn>(
        ["text", "email", "password", "number", "customBox", "textarea"],
        k => k,
        () => ReadonlyInputWithLength
    ),
    ...toMap<InputOptionType, InputOptionRenderFn>(
        ["radio", "select"],
        k => k,
        () => ReadonlySelectInput
    ),
    collection: ReadonlyCollectionInput
}
