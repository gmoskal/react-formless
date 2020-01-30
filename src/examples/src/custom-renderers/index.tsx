import * as React from "react"
import { useFormHook, toResult, FormView } from "../../../"
import { labelize } from "../utils"

import { readOnlyRenderMap } from "./ReadonlyRenderMap"
import { react95Inputs, react95Elements } from "./React95"
import { antDesignRenderMap } from "./AntDesignRenderMap"

export type Car = { make: string }

const carMakes: Array<[string, string]> = [
    ["Tesla", "tesla-id"],
    ["Honda", "honda-id"],
    ["BMW", "bmw-id"]
]

const schema: FormSchema<Car> = { make: { type: "select", values: carMakes } }

export const CustomRenderersForm: React.FC = () => {
    const { formViewProps } = useFormHook({ schema })
    return <MultiRenderFormView {...formViewProps} />
}

const renderTypes = ["Plain", "AntDesign", "Readonly", "React95"] as const
const themes: Array<[string, string]> = renderTypes.map(v => [labelize(v), v])

const themeSchema: FormSchema<{ renderType: string }> = { renderType: { type: "select", values: themes } }

export const MultiRenderFormView: React.FC<FormViewProps<any>> = p => {
    const { formViewProps } = useFormHook({ initialValue: { renderType: "Plain" }, schema: themeSchema })
    const [renderOptions, setRenderOptions] = React.useState<RenderOptions>({ renderType: "Plain" })
    React.useEffect(() => {
        const selectedRender = formViewProps.state.renderType.value
        const renderType: RenderType = selectedRender === "Plain" ? "Plain" : "Custom"
        const options = ((): RenderOptions => {
            switch (selectedRender) {
                case "React95":
                    return { inputsRenderMap: react95Inputs, elementsRenderMap: react95Elements }
                case "AntDesign":
                    return { inputsRenderMap: antDesignRenderMap }
                case "Readonly":
                    return { inputsRenderMap: readOnlyRenderMap }
            }
            return {}
        })()

        setRenderOptions({ renderType, ...options })
    }, [formViewProps.state, formViewProps.state.renderType.value])

    return (
        <>
            <h2>Select render type</h2>
            <FormView {...formViewProps} renderType="AntDesign" />
            <div style={{ border: "1px solid #eee", padding: 10, margin: "5px 0" }}>
                <FormView {...p} {...renderOptions} />
            </div>
            <h3>Validation result</h3>
            <pre>{JSON.stringify(toResult(p.schema, p.state), null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
