import * as React from "react"
import { FormView, useFormHook, toResult } from "../../.."

export type Car = { make: string }
const carMakes: Array<[string, string]> = [
    ["Tesla", "tesla-id"],
    ["Honda", "honda-id"],
    ["BMW", "bmw-id"]
]

const schema: FormSchema<Car> = { make: { type: "select", values: carMakes } }

export const InputSelectForm: React.FC = () => {
    const { formViewProps: p } = useFormHook({ initialValue: { make: carMakes[0][1] }, schema })
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
