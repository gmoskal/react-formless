import * as React from "react"
import { FormView, useFormHook, FormSchema } from "@react-formless/core"

const sexes: Array<[string, string]> = [
    ["Male", "male"],
    ["Female", "female"]
]

const schema: FormSchema<{ sex: string }> = { sex: { type: "radio", values: sexes } }

export const InputRadioForm: React.FC = () => {
    const { formViewProps: p, result } = useFormHook({ initialValue: { sex: sexes[0][1] }, schema })
    return (
        <>
            <FormView {...p} />
            <h3>Validation result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
