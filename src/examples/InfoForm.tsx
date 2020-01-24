import * as React from "react"
import { useFormHook, FormView } from ".."
import { ReadonlyInputWithLength } from "./loginForm"
import { _noop } from "../utils"

export type Info = { sex: string }

const sexes: Array<[string, string]> = [
    ["Male", "male"],
    ["Female", "female"]
]

const schema: FormSchema<Info> = {
    sex: { type: "radio", placeholder: "Secret", values: sexes }
}

export const ReadonlyRadioInput: InputOptionRenderFn = p => (
    <>
        {p.schema.values.map(([name, value]) => (
            <span
                style={{
                    border: "1px solid red",
                    padding: 5,
                    margin: 5,
                    borderColor: p.state.value === value ? "blue" : "gray"
                }}
                key={value}>
                {name}
            </span>
        ))}
    </>
)

const customRenderMap: Partial<InputRenderMap> = { radio: ReadonlyRadioInput }

export const InfoForm: React.FC = p => {
    const initialValue: Info = { sex: "" }
    const { formViewProps, onSubmitClick } = useFormHook({ initialValue, onSubmit: _noop, schema })
    return (
        <>
            <h2>Login Forms</h2>
            <h3>using Plain renderer</h3>
            <FormView {...formViewProps} />
            <h3>using AntDesign renderer</h3>
            <FormView {...formViewProps} rendeType="AntDesign" />
            <h3>usign Custom renderer</h3>
            <FormView {...formViewProps} customRenderMap={customRenderMap} />
            <button onClick={onSubmitClick}>Login</button>
            <h3>state</h3>
            <pre>{JSON.stringify(formViewProps.state, null, 2)}</pre>
        </>
    )
}
