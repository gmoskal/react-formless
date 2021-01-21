import * as React from "react"
import { F1, F0, State, FArgs, TMap, Result, Validators, ArrayItem } from "@react-formless/utils"
import { ValueState, StateValue } from "@react-formless/utils"
import { toFormState, toResult, validateForm, isFormActive } from "./forms"
import { StyledFormViewProps } from "./components/StyledFormView"
import { InputViewProps } from "./components/FormView"

export { validators, guards } from "@react-formless/utils"

export { toFormState, toInputState, getInputProps, getExtInputProps, toResult } from "./forms"
export { StyledFormView } from "./components/StyledFormView"
export { FormView, getElementsRenderMap, FormItemView } from "./components/FormView"
export { plainHtmlRenderMap, plainHtmlElementRenderMap } from "./components/PlainHtmlRenderMap"

export type Tuples<T = string> = Array<[string, T]>

export type RProps<T> = T extends React.FC<infer P> ? React.PropsWithChildren<P> : never
export type RDiv = React.FC<React.HTMLAttributes<HTMLDivElement>>
export type RButton = React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>

export type ElementsRenderMap = {
    Button: RButton
    ItemWrapper: RDiv
    ItemChildrenWrapper: RDiv
    DefaultFormItem: RenderFn<any>
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
    "name" | "placeholder" | "id" | "onChange" | "value" | "disabled" | "readOnly"
>

export type ExtInputProps<T> = StandardInputProps<T> & { onFocus: F0; onBlur: F0 }

// eslint-disable-next-line @typescript-eslint/ban-types
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

export type Mutate<T> = {
    createValue: ArrayItem<T> | F0<ArrayItem<T>>
    addFirstLabel?: string
    addNextLabel: string
    removeLabel?: string
}
export type Mutable<T> = { mutate?: Mutate<T> }

export type InputBoxSchema<T> = InputSchemaBase<InputBoxType, T>
export type InputOptionSchema<T> = InputSchemaBase<InputOptionType, T, { values: Tuples<T> }>
export type SimpleInputSchema<T> = InputBoxSchema<T> | InputOptionSchema<T>

export type CustomInputBoxSchema<T> = InputSchemaBase<"customBox", T, { subtype: string }>
export type CustomInputOptionSchema<T> = InputSchemaBase<"customOption", T, { values: Tuples<T>; subtype: string }>

export type CollectionInputSchema<T> = Omit<
    InputSchemaBase<"collection", T, { fields: FormSchema<ArrayItem<T>> } & Mutable<T>>,
    "validators"
>
export type ListInputSchema<T> = InputSchemaBase<"list", T, { field: SimpleInputSchema<T> } & Mutable<T>>
export type MultiselectInputSchema<T> = InputSchemaBase<
    "multiselect",
    T,
    { values: Tuples<ArrayItem<T>>; subtype: "multiselect" | "combobox" }
>

export type InputSchema<T> =
    | SimpleInputSchema<T>
    | CollectionInputSchema<T>
    | ListInputSchema<T>
    | MultiselectInputSchema<T>
    | CustomInputBoxSchema<T>
    | CustomInputOptionSchema<T>

export type FormSchema<T> = { [P in keyof T]: InputSchema<T[P]> }
export type StyledTitle = ValueState<"Title", string>
export type StyledCustom<T2> = ValueState<"Custom", T2>
export type StyledCell<T, T2> = keyof T | StyledTitle | StyledCustom<T2>
export type StyledRow<T, T2> = ValueState<"Row", Array<StyledCell<T, T2>>>
export type StyledInputSchema<T, T2> = StyledTitle | StyledRow<T, T2> | StyledCustom<T2>
export type StyledFormSchema<T, T2 = any> = Array<StyledInputSchema<T, T2> | keyof FormSchema<T>>

export type GetPropsFn<T = any, TKey extends keyof FormSchema<T> = any> = (
    key: TKey,
    schema: FormSchema<T>[TKey]
) => InputViewProps
export type StyledInputsRenderMap<T = any, T2 = any> = {
    Title: React.FC<{ value: StateValue<StyledTitle> }>
    Custom: React.FC<{ value: StateValue<StyledCustom<T2>> } & StyledFormViewProps<T, T2> & { getProps: GetPropsFn }>
    Row: React.FC<{ value: React.ReactElement[] }>
}

export type InputState<T> = {
    active: boolean
    visited: boolean
    validationResult?: Result<T, string>
    value?: T
}

export type FormLeafState<T> = T extends Array<infer E>
    ? Array<FormState<E>> | InputState<Array<E>> | Array<InputState<E>>
    : InputState<T>

export type FormState<T> = { [P in keyof T]: FormLeafState<T[P]> }

export type InputResult<T> = T extends Array<infer E> ? Array<FormResult<E>> : Result<T, string>

export type FormResult<T> = { [P in keyof T]: InputResult<T[P]> }

export type RenderOptionsProps = { renderOptions: RenderOptions }
export type InputPropsBase<TSchema extends InputSchemaBase = any, TState = any, TDelta = F1<TState>> = {
    schema: TSchema
    state: TState
    setDelta: TDelta
} & RenderOptionsProps

export type SimpleInputProps = ArrayItem<
    FArgs<InputRenderMap[keyof Omit<InputRenderMap, "list" | "collection" | "multiselect">]>
>
export type InputProps = ArrayItem<FArgs<InputRenderMap[keyof InputRenderMap]>>

export type RenderFn<T> = React.FC<T>
export type RenderParams<T extends RenderFn<any>> = T extends RenderFn<infer E> ? E : never

export type InputBoxType = "text" | "email" | "number" | "textarea" | "password" | "hidden"
export type InputBoxRenderFn<T = any> = RenderFn<InputPropsBase<InputBoxSchema<T>, InputState<T>>>
export type InputBoxRenderMap<T = any> = TMap<InputBoxType, InputBoxRenderFn<T>>

export type InputOptionType = "radio" | "select"
export type InputOptionRenderFn<T = any> = RenderFn<InputPropsBase<InputOptionSchema<T>, InputState<T>>>
export type InputOptionRenderMap<T = any> = TMap<InputOptionType, InputOptionRenderFn<T>>

export type InputMultiselectRenderFn<T = any> = RenderFn<InputPropsBase<MultiselectInputSchema<T>, InputState<T[]>>>
export type InputListRenderFn<T = any> = RenderFn<InputPropsBase<ListInputSchema<T>, InputState<T>[]>>
export type InputCollectionRenderFn<T = any> = RenderFn<
    InputPropsBase<CollectionInputSchema<T>, FormState<T>[], F1<FormState<T>[]>>
>

export type CustomBoxRenderFn<T = any> = RenderFn<InputPropsBase<CustomInputBoxSchema<T>, InputState<T>>>
export type CustomOptionRenderFn<T = any> = RenderFn<InputPropsBase<CustomInputBoxSchema<T>, InputState<T>>>

export type InputRenderMap<T = any> = InputBoxRenderMap<T> &
    InputOptionRenderMap<T> & {
        customBox: CustomBoxRenderFn<T>
        customOption: CustomOptionRenderFn<T>
        list: InputListRenderFn<T>
        collection: InputCollectionRenderFn<T>
        multiselect: InputMultiselectRenderFn<T>
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
    handleSubmit: (event?: React.FormEvent) => void
    result: Result<T, T>
    resetState: F0
    active: boolean
    submitted: boolean
    touched: boolean
}

export const useFormHook = <T extends any>({ schema, ...p }: FormHookProps<T>): FormHookResult<T> => {
    const [state, setState] = React.useState(toFormState<T>(schema, (p.initialValue || {}) as any))
    const [touched, setTouched] = React.useState(false)
    const [submitted, setSubmitted] = React.useState(false)
    const result = toResult(schema, state)
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        setSubmitted(true)
        if (!touched) setTouched(true)
        if (result.type === "Err") setState(validateForm(schema, state))
        else if (p.onSubmit) p.onSubmit(result.value)
    }

    const resetState = () => {
        setState(toFormState(schema, p.initialValue as any))
        setTouched(false)
        setSubmitted(false)
    }

    return {
        handleSubmit,
        result,
        formViewProps: {
            state,
            setState: s => {
                if (!touched) setTouched(true)
                setState(s)
            },
            schema
        },
        resetState,
        submitted,
        touched,
        active: isFormActive(schema, state)
    }
}
