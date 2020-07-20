import * as React from "react"
import {
    FormViewProps,
    StyledFormSchema,
    RenderOptions,
    FormSchema,
    StyledInputSchema,
    FormItemView,
    StyledInputsRenderMap
} from ".."
import { pickObject } from "../../../utils"
import { InputViewProps } from "./FormView"
import { styledInputsRenderMap } from "./PlainHtmlRenderMap"
import { omitObject } from "@react-formless/utils/map"

const isKeyOf = <T extends any>(v: any, keys: string[] = []): v is keyof T =>
    typeof v === "string" && (keys.includes(v) || keys.length === 0)

export const StyledCellView = <T, T2 = any>(
    p: StyledFormViewProps<T, T2> & {
        cell: StyledInputSchema<T, T2> | keyof T
        styledInputsRenderMap: StyledInputsRenderMap<T, T2>
    }
) => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderOptions: RenderOptions = pickObject(p, ["elementsRenderMap", "inputsRenderMap"])

    const getProps = <TKey extends keyof FormSchema<T>>(key: TKey, schema: FormSchema<T>[TKey]): InputViewProps => ({
        schema,
        state: p.state[key],
        setDelta: setDelta(key),
        renderOptions
    })

    if (isKeyOf<T>(p.cell)) {
        const f: keyof T = p.cell
        return <FormItemView {...getProps(f, p.schema[f])} />
    }

    switch (p.cell.type) {
        case "Row":
            return (
                <p.styledInputsRenderMap.Row
                    value={p.cell.value.map((f, i) => <StyledCellView {...p} key={`${i}`} cell={f} />) as any}
                />
            )
        case "Title":
            return <p.styledInputsRenderMap.Title value={p.cell.value} />
        case "Custom":
            return (
                <p.styledInputsRenderMap.Custom
                    {...omitObject(p, ["cell", "styledInputsRenderMap"])}
                    getProps={getProps}
                    value={p.cell.value}
                />
            )
    }
    return null
}

export type StyledFormViewProps<T, T2> = FormViewProps<T> & {
    styledSchema: StyledFormSchema<T, T2>
    styledInputsRenderMap?: Partial<StyledInputsRenderMap<T, T2>>
}
export const StyledFormView = <T extends any, T2 extends any>(p: StyledFormViewProps<T, T2>): React.ReactElement => (
    <>
        {p.styledSchema.map((e, index) => (
            <StyledCellView
                key={index}
                {...p}
                cell={e}
                styledInputsRenderMap={{
                    ...(styledInputsRenderMap as StyledInputsRenderMap<T, T2>),
                    ...(p.styledInputsRenderMap || {})
                }}
            />
        ))}
    </>
)
