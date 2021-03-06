import * as React from "react"

import { useFormHook, FormView, FormSchema } from "@react-formless/core"
import { antDesignRenderMap } from "."

export type Car = { make: string }

const carMakes: Array<[string, string]> = [
    ["Tesla", "tesla-id"],
    ["Honda", "honda-id"],
    ["BMW", "bmw-id"]
]

const schema: FormSchema<Car> = { make: { type: "select", values: carMakes } }

export const AntDesignForm: React.FC = () => {
    const { formViewProps } = useFormHook({ schema })
    return <FormView {...formViewProps} inputsRenderMap={antDesignRenderMap} />
}
