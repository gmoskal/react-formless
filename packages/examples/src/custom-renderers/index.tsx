import * as React from "react"

import { useFormHook, FormView, FormSchema, RenderOptions, FormViewProps } from "@react-formless/core"
import { antDesignRenderMap } from "@react-formless/antd"
import { react95Inputs, react95Elements } from "@react-formless/react95"

import { labelize } from "@react-formless/utils/misc"

import { readOnlyRenderMap } from "./ReadonlyRenderMap"

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
export type RenderType = typeof renderTypes[number]
const themes: Array<[string, RenderType]> = renderTypes.map(v => [labelize(v), v])

const themeSchema: FormSchema<{ renderType: RenderType }> = { renderType: { type: "select", values: themes } }

export const MultiRenderFormView: React.FC<FormViewProps<any>> = p => {
    const { formViewProps, result } = useFormHook({
        initialValue: { renderType: "Plain" as RenderType },
        schema: themeSchema
    })
    const [renderOptions, setRenderOptions] = React.useState<RenderOptions>({})
    React.useEffect(() => {
        const selectedRender: RenderType | undefined = formViewProps.state.renderType.value
        switch (selectedRender) {
            case "React95":
                setRenderOptions({ inputsRenderMap: react95Inputs, elementsRenderMap: react95Elements })
                return
            case "AntDesign":
                setRenderOptions({ inputsRenderMap: antDesignRenderMap })
                return
            case "Readonly":
                setRenderOptions({ inputsRenderMap: readOnlyRenderMap })
                return
            default:
                setRenderOptions({})
        }
    }, [formViewProps.state, formViewProps.state.renderType.value])

    return (
        <>
            <h2>Select render type</h2>
            <FormView {...formViewProps} inputsRenderMap={antDesignRenderMap} />
            <div style={{ border: "1px solid #eee", padding: 10, margin: "5px 0" }}>
                <FormView {...p} {...renderOptions} />
            </div>
            <h3>Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
