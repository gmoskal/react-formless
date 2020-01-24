import * as React from "react"
import { useFormHook } from ".."
import { MultiRenderFormView } from "./MultiRenderFormView"

export type Car = { make: string }

const carMakes: Array<[string, string]> = [
    ["Tesla", "tesla-id"],
    ["Honda", "honda-id"],
    ["BMW", "bmw-id"]
]

const schema: FormSchema<Car> = { make: { type: "select", values: carMakes } }

export const InputSelectForm: React.FC = () => {
    const { formViewProps } = useFormHook({ initialValue: { make: carMakes[0][1] }, schema })
    return <MultiRenderFormView title="Select" {...formViewProps} />
}
