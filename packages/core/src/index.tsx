import * as React from "react"
import { F1, F0, State, FArgs, Dict, Result, Validators } from "@react-formless/utils"

export { validators, guards } from "@react-formless/utils"

export { toFormState, toInputState, getInputProps, toResult } from "./forms"
export { FormView, getElementsRenderMap, FormItemView } from "./components/FormView"
export { plainHtmlRenderMap } from "./components/PlainHtmlRenderMap"

export type Tuples<T = string> = Array<[string, T]>
export type ArrayItem<T> = T extends Array<infer E> ? E : T

export type RProps<T> = T extends React.FC<infer P> ? React.PropsWithChildren<P> : never
export type RDiv = React.FC<React.HTMLAttributes<HTMLDivElement>>
export type RButton = React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>

export type ElementsRenderMap = {
    Button: RButton
    ItemWrapper: RDiv
    ItemChildrenWrapper: RDiv
    DefaultFormItem: RenderFn<any, any>
    Title: React.FC<{ text?: string }>
    Label: React.FC<{ text?: string } | { htmlFor: string }>
    Error: React.FC<InputState<any>>
}

export type RenderOptions = {
    elementsRenderMap?: Partial<ElementsRenderMap>
    inputsRenderMap?: Partial<InputRenderMap>
}

export type StandardInputProps<T> = Pick<
    React.InputHTMLAttributes<T>,
    "name" | "placeholder" | "id" | "onChange" | "value" | "disabled"
>

export type ExtInputProps<T> = StandardInputProps<T> & { onFocus: F0; onBlur: F0 }

export type InputSchemaBase<TName extends InputType = InputType, T = any, TExtra = {}> = State<
    TName,
    {
        validators?: Validators<T, string>
        toValue?: F1<string, T | null>
        fromValue?: F1<T | null, string>
        sectionTitle?: string
    } & StandardInputProps<T> &
        TExtra
>

export type InputBoxSchema<T> = InputSchemaBase<InputBoxType, T>
export type InputOptionSchema<T> = InputSchemaBase<InputOptionType, T, { values: Tuples<T> }>
export type SimpleInputSchema<T> = InputBoxSchema<T> | InputOptionSchema<ArrayItem<T>>

export type Mutable<T> = {
    mutate?: { createValue: ArrayItem<T>; addFirstLabel?: string; addNextLabel: string; removeLabel?: string }
}
export type CollectionInputSchema<T> = InputSchemaBase<
    "collection",
    T,
    { fields: FormSchema<ArrayItem<T>> } & Mutable<T>
>
export type ListInputSchema<T> = InputSchemaBase<"list", T, { field: SimpleInputSchema<T> } & Mutable<T>>
export type ChipsInputSchema<T = string> = InputSchemaBase<"chips", T, { field: SimpleInputSchema<T[]> } & Mutable<T>>

export type InputSchema<T> = SimpleInputSchema<T> | CollectionInputSchema<T> | ListInputSchema<T> | ChipsInputSchema<T>

export type FormSchema<T> = { [P in keyof T]: InputSchema<T[P]> }

export type InputState<T> = {
    active: boolean
    visited: boolean
    validationResult?: Result<T, string>
    value?: T
}

export type FormLeafState<T> = T extends Array<infer E>
    ? Array<FormState<E>> | InputState<E[]> | InputState<E>[]
    : InputState<T>

export type FormState<T> = { [P in keyof T]: FormLeafState<T[P]> }

export type InputResult<T> = T extends Array<infer E> ? Array<FormResult<E>> : Result<T, string>

export type FormResult<T> = { [P in keyof T]: InputResult<T[P]> }

export type RenderOptionsProps = { renderOptions: RenderOptions }
export type InputPropsBase<TSchema extends InputSchemaBase = any, TState = any, TDelta = F1<any>> = {
    schema: TSchema
    state: TState
    setDelta: TDelta
} & RenderOptionsProps

export type SimpleInputProps = ArrayItem<FArgs<InputRenderMap[keyof Omit<InputRenderMap, "list" | "collection">]>>
export type InputProps = ArrayItem<FArgs<InputRenderMap[keyof InputRenderMap]>>

export type RenderFn<TSchema extends InputSchemaBase, TState, TDelta = F1<TState>> = React.FC<
    InputPropsBase<TSchema, TState, TDelta>
>

export type InputBoxType = "text" | "email" | "number" | "textarea" | "password" | "customBox"
export type InputBoxRenderFn<T = any> = RenderFn<InputBoxSchema<T>, InputState<T>>
export type InputBoxRenderMap<T = any> = Dict<InputBoxType, InputBoxRenderFn<T>>

export type InputOptionType = "radio" | "select" | "customOption"
export type InputOptionRenderFn<T = any> = RenderFn<InputOptionSchema<T>, InputState<T>>
export type InputOptionRenderMap<T = any> = Dict<InputOptionType, InputOptionRenderFn<T>>

export type InputChipstRenderFn<T = any> = RenderFn<InputOptionSchema<T>, InputState<T[]>, F1<InputState<T[]>>>
export type InputListRenderFn<T = any> = RenderFn<ListInputSchema<T>, Array<InputState<T>>>
export type InputCollectionRenderFn<T = any> = RenderFn<
    CollectionInputSchema<T>,
    Array<FormState<T>>,
    F1<Array<FormState<T>>>
>

export type InputRenderMap<T = any> = InputBoxRenderMap<T> &
    InputOptionRenderMap<T> & {
        chips: InputChipstRenderFn<T>
        list: InputListRenderFn<T>
        collection: InputCollectionRenderFn<T>
    }

export type InputType = keyof InputRenderMap

export type FormViewProps<T> = RenderOptions & {
    setState: F1<FormState<T>>
    state: FormState<T>
    schema: FormSchema<T>
}

export type FormHookProps<T> = {
    initialValue?: Partial<T>
    schema: FormSchema<T>
    onSubmit?: F1<T>
}

export type FormHookResult<T> = {
    formViewProps: FormViewProps<T>
    onSubmitClick: F0
    onSubmitClickReset: F0
    result: Result<T, T>
    resetState: F0
}

import { toFormState, toResult, validateForm } from "./forms"
export const useFormHook = <T extends any>({ schema, ...p }: FormHookProps<T>): FormHookResult<T> => {
    const [state, setState] = React.useState(toFormState<T>(schema, (p.initialValue || {}) as any))
    const onSubmitClick = () => {
        const res = toResult(schema, state)
        if (res.type === "Err") setState(validateForm(schema, state))
        else if (p.onSubmit) p.onSubmit(res.value)
    }
    const resetState = () => setState(toFormState(schema, p.initialValue as any))
    return {
        onSubmitClick,
        onSubmitClickReset: () => {
            onSubmitClick()
            resetState()
        },
        result: toResult(schema, state),
        formViewProps: { state, setState, schema },
        resetState
    }
}
