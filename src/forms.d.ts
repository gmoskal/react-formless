/// <reference path="./global.d.ts" />

type Tuples<T = string> = Array<[string, T]>
type ArrayItem<T> = T extends Array<infer E> ? E : T

type SharedInputProps = Pick<React.InputHTMLAttributes<any>, "disabled" | "placeholder" | "name" | "id">
type InputSchemaBase<TName extends InputType, T, TExtra = {}> = State<
    TName,
    {
        validators?: Validators<T, string>
        toValue?: F1<string, T | null>
        fromValue?: F1<T | null, string>
        sectionTitle?: string
    } & SharedInputProps &
        TExtra
>

type InputBoxSchema<T> = InputSchemaBase<InputBoxType, T>
type InputOptionSchema<T> = InputSchemaBase<InputOptionType, T, { values: Tuples<T> }>
type SimpleInputSchema<T> = InputBoxSchema<T> | InputOptionSchema<ArrayItem<T>>

type Mutable<T> = { mutate?: { createValue: ArrayItem<T>; createLabel: string; removeLabel?: string } }
type CollectionInputSchema<T> = InputSchemaBase<"collection", T, { fields: FormSchema<ArrayItem<T>> } & Mutable<T>>
type ListInputSchema<T> = InputSchemaBase<"list", T, { field: SimpleInputSchema<T> } & Mutable<T>>
type ChipsInputSchema<T = string> = InputSchemaBase<"chips", T, { field: SimpleInputSchema<T[]> } & Mutable<T>>

type InputSchema<T> = SimpleInputSchema<T> | CollectionInputSchema<T> | ListInputSchema<T> | ChipsInputSchema<T>

type FormSchema<T> = { [P in keyof T]: InputSchema<T[P]> }

type InputState<T> = {
    active: boolean
    visited: boolean
    validationResult?: Result<T, string>
    value?: T
}

type FormLeafState<T> = T extends Array<infer E>
    ? Array<FormState<E>> | InputState<E[]> | InputState<E>[]
    : InputState<T>

type FormState<T> = { [P in keyof T]: FormLeafState<T[P]> }

type InputResult<T> = T extends Array<infer E> ? Array<FormResult<E>> : Result<T, string>

type FormResult<T> = { [P in keyof T]: InputResult<T[P]> }

type InputPropsBase<TSchema extends InputSchemaBase<InputType, any>, TState, TDelta = F1<any>> = {
    schema: TSchema
    state: TState
    setDelta: TDelta
}

type SimpleInputProps = ArrayItem<FArgs<InputRenderMap[keyof Omit<InputRenderMap, "list" | "collection">]>>
type InputProps = ArrayItem<FArgs<InputRenderMap[keyof InputRenderMap]>>

type RenderFn<TSchema extends InputSchemaBase<InputType, any>, TState, TDelta = F1<TState>> = F1<
    InputPropsBase<TSchema, TState, TDelta>,
    React.ReactElement
>

type InputBoxType = "text" | "email" | "number" | "textarea" | "password" | "customBox"
type InputBoxRenderFn<T = any> = RenderFn<InputBoxSchema<T>, InputState<T>>
type InputBoxRenderMap<T = any> = Dict<InputBoxType, InputBoxRenderFn<T>>

type InputOptionType = "radio" | "dropdown" | "selectableChips" | "customOption"
type InputOptionRenderFn<T = any> = RenderFn<InputOptionSchema<T>, InputState<T>>
type InputOptionRenderMap<T = any> = Dict<InputOptionType, InputOptionRenderFn<T>>

type InputChipstRenderFn<T = any> = RenderFn<InputOptionSchema<T>, InputState<T[]>, F1<InputState<T[]>>>
type InputListRenderFn<T = any> = RenderFn<ListInputSchema<T>, Array<InputState<T>>>
type InputCollectionRenderFn<T = any> = RenderFn<CollectionInputSchema<T>, Array<FormState<T>>>

type InputRenderMap<T = any> = InputBoxRenderMap<T> &
    InputOptionRenderMap<T> & {
        chips: InputChipstRenderFn<T>
        list: InputListRenderFn<T>
        collection: InputCollectionRenderFn<T>
    }

type InputType = keyof InputRenderMap
