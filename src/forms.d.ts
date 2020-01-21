/// <reference path="./global.d.ts" />

type Tuples<T = string> = Array<[string, T]>
type ArrayItem<T> = T extends Array<infer E> ? E : T

type InputSchemaBase<T> = {
    validators?: Validators<T, string>
    toValue?: F1<string, T | null>
    fromValue?: F1<T | null, string>
    sectionTitle?: string
} & Pick<React.InputHTMLAttributes<any>, "disabled" | "placeholder" | "name">

type InputBoxSchema<T> = InputSchemaBase<T> & State<"text" | "email" | "number" | "textarea" | "password">
type InputOptionSchema<T> = InputSchemaBase<T> & State<"radio" | "dropdown" | "selectableChips", { values: Tuples<T> }>
type SimpleInputSchema<T> = InputBoxSchema<T> | InputOptionSchema<ArrayItem<T>>

type Mutable<T> = { createValue: ArrayItem<T>; createLabel: string; removeLabel?: string }
type CreatableInput<T> = InputSchemaBase<T> & { mutate?: Mutable<T> }
type CollectionInputSchema<T> = CreatableInput<T> & State<"collection", { fields: FormSchema<ArrayItem<T>> }>
type ListInputSchema<T> = CreatableInput<T> & State<"list", { field: SimpleInputSchema<T> }>
type ChipsInputSchema<T = string> = CreatableInput<T> & State<"chips", { field: SimpleInputSchema<T[]> }>

type InputSchema<T> = SimpleInputSchema<T> | CollectionInputSchema<T> | ListInputSchema<T> | ChipsInputSchema

type FormSchema<T> = { [P in keyof T]: InputSchema<T[P]> }

type InputState<T> = {
    active: boolean
    visited: boolean
    validationResult?: Result<T, string>
    value?: T
}

type FormState<T> = {
    [P in keyof T]: T[P] extends Array<infer E>
        ? Array<FormState<E>> | InputState<E[]> | InputState<E>[]
        : InputState<T[P]>
}

type InputResult<T> = T extends Array<infer E> ? Array<FormResult<E>> : Result<T, string>

type FormResult<T> = { [P in keyof T]: InputResult<T[P]> }
