import * as React from "react"
import { FormView, useFormHook, toResult, FormSchema } from "@react-formless/core"

export type Info = { sex: string }

const sexes: Array<[string, string]> = [
    ["Male", "male"],
    ["Female", "female"]
]

const schema: FormSchema<Info> = { sex: { type: "radio", values: sexes } }

export const InputRadioForm: React.FC = () => {
    const { formViewProps: p } = useFormHook({ initialValue: { sex: sexes[0][1] }, schema })
    return (
        <>
            <FormView {...p} />
            <h3>Validation result</h3>
            <pre>{JSON.stringify(toResult(p.schema, p.state), null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
