/// <reference path="./global.d.ts" />

type Tuples<T = string> = Array<[string, T]>
type ArrayItem<T> = T extends Array<infer E> ? E : T

type SharedInputProps = Pick<React.InputHTMLAttributes<any>, "disabled" | "placeholder" | "name" | "id">
type InputSchemaBase<TName extends string, T, TExtra = {}> = State<
    TName,
    {
        validators?: Validators<T, string>
        toValue?: F1<string, T | null>
        fromValue?: F1<T | null, string>
        sectionTitle?: string
    } & SharedInputProps &
        TExtra
>

type InputBoxSchema<T> = InputSchemaBase<"text" | "email" | "number" | "textarea" | "password", T>
type InputOptionSchema<T> = InputSchemaBase<"radio" | "dropdown" | "selectableChips", T, { values: Tuples<T> }>
type SimpleInputSchema<T> = InputBoxSchema<T> | InputOptionSchema<ArrayItem<T>>

type Mutable<T> = { createValue: ArrayItem<T>; createLabel: string; removeLabel?: string }
type CreatableInput<TName extends string, T, TExtra> = InputSchemaBase<TName, T, { mutate?: Mutable<T> } & TExtra>
type CollectionInputSchema<T> = CreatableInput<"collection", T, { fields: FormSchema<ArrayItem<T>> }>
type ListInputSchema<T> = CreatableInput<"list", T, { field: SimpleInputSchema<T> }>
type ChipsInputSchema<T = string> = CreatableInput<"chips", T, { field: SimpleInputSchema<T[]> }>

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
