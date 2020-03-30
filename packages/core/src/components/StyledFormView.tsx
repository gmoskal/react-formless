import * as React from "react"
import { FormViewProps, StyledFormSchema, RenderOptions, FormSchema, StyledInputSchema, FormItemView } from ".."
import { pickObject } from "../../../utils"
import { InputViewProps } from "./FormView"
import { styledInputsRenderMap } from "./PlainHtmlRenderMap"

export const StyledFormView = <T extends any>(
    p: FormViewProps<T> & { styledSchema: StyledFormSchema<T> }
): React.ReactElement => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderOptions: RenderOptions = pickObject(p, ["elementsRenderMap", "inputsRenderMap"])

    const getProps = <TKey extends keyof FormSchema<T>>(key: TKey, schema: FormSchema<T>[TKey]): InputViewProps => ({
        schema,
        state: p.state[key],
        setDelta: setDelta(key),
        renderOptions
    })

    const render = (e: StyledInputSchema<T>) => {
        const StyledFormItem = styledInputsRenderMap[e.type]

        if (e.type === "Row")
            return (
                <StyledFormItem>
                    {e.fields.map((f, i) => (
                        <React.Fragment key={`${f}-${i}`}>
                            <FormItemView {...getProps(f, p.schema[f])} />
                        </React.Fragment>
                    ))}
                </StyledFormItem>
            )
        if (e.type === "Title") return <StyledFormItem>{e.text}</StyledFormItem>
    }

    return (
        <>
            {p.styledSchema.map((e, index) => (
                <React.Fragment key={index}>
                    {typeof e === "string" ? (
                        <FormItemView {...getProps(e, p.schema[e])} />
                    ) : (
                        render(e as StyledInputSchema<T>)
                    )}
                </React.Fragment>
            ))}
        </>
    )
}
