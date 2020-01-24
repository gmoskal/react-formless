import * as React from "react"
import { toMap } from "../utils/map"

export const ReadonlyInputWithLength: InputBoxRenderFn<any> = p => (
    <>
        <h4 style={{ border: "1px solid #ddd", borderRadius: 5, background: "#eee", padding: 5 }}>
            {p.state.value || p.schema.placeholder || ""}
        </h4>
        <h5>{`length: ${p.state.value?.length || 0}`}</h5>
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
    )
}
