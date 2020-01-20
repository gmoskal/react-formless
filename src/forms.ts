import { runValidatorsRaw, Ok, Err, isEmpty } from "./utils/validators"
import { mapObject, arrify } from "./utils/map"
import { toOption } from "./utils/types"

export const toFormState = <T>(schema: FormSchema<T>, value: T): FormState<T> =>
    mapObject(schema, (k, s: InputSchema<any>) =>
        toInputState(s as any, s.fromValue ? s.fromValue(value[k] as any) : value[k])
    ) as any

export const validateForm = <T>(schema: FormSchema<T>, state: FormState<T>): FormState<T> =>
    mapObject(schema, (k, s: InputSchema<any>) => validateInput(s as any, (state as any)[k]) as any)

function validateInput<T>(
    schema: InputSchema<T>,
    state: InputState<T> | Array<FormState<ArrayItem<T>>>
): InputState<T> | Array<InputState<T>> | Array<FormState<ArrayItem<T>>> {
    if (Array.isArray(state) && schema.type === "collection")
        return (state as any[]).map(v => validateForm(schema.fields, v) as FormState<ArrayItem<T>>)
    if (Array.isArray(state) && schema.type === "list")
        return (state as any[]).map(v => validateInput(schema.field, v) as InputState<T>)

    const s = state as InputState<T>
    return {
        ...s,
        visited: true,
        validationResult: schema.validators ? runValidatorsRaw(schema.validators, s.value) : Ok(s.value)
    } as any
}

export const formStateToFormResult = <T>(schema: FormSchema<T>, state: FormState<T>): FormResult<T> =>
    mapObject(schema, (k, s: InputSchema<any>) => inputStateToInputResult(s as any, (state as any)[k]) as any)

function inputStateToInputResult<T>(s: CollectionInputSchema<T>, state: Array<FormState<ArrayItem<T>>>): InputResult<T>
function inputStateToInputResult<T>(s: SimpleInputSchema<T>, state: InputState<T>): Result<T, string>
function inputStateToInputResult<T>(
    schema: InputSchema<T>,
    state: InputState<T> | Array<FormState<ArrayItem<T>>>
): Result<T, string> | Array<{ [K in keyof T]: Result<T, string> }> {
    if (Array.isArray(state) && schema.type === "collection")
        return (state as any[]).map(v => formStateToFormResult(schema.fields, v) as any)
    if (Array.isArray(state) && schema.type === "list")
        return (state as any[]).map(v => inputStateToInputResult(schema.field, v) as any)

    const s: InputState<T> = state as any
    if ((s.visited || s.active) && s.validationResult) return s.validationResult
    const value = schema.toValue ? schema.toValue((state as any).value) : (state as any).value
    return schema.validators ? runValidatorsRaw(schema.validators, value) : Ok(value)
}

export const toResult = <T>(schema: FormSchema<T>, state: FormState<T>): Result<T, T> => {
    const res = formStateToFormResult(schema, state)
    return formResultToResult(schema, res)
}

export const formResultToResult = <T>(schema: FormSchema<T>, res: FormResult<T>): Result<T, T> => {
    const errors: any = []
    const maybeT = formResultToResultRaw(schema, res, e => errors.push(e))
    return errors.length ? Err(errors, maybeT) : Ok((maybeT as any) as T)
}

const formResultToResultRaw = <T>(schema: FormSchema<T>, res: FormResult<T>, attachError: F1<any>): T =>
    mapObject(res, (key, v) => inputStateToResult(schema[key], v as any, e => attachError({ ...e, key })) as any)

function inputStateToResult<T>(
    schema: InputSchema<T>,
    vs: InputResult<T> | Array<InputResult<ArrayItem<T>>>,
    attachError: F1<any>
): T | T[] | Array<ArrayItem<T>> {
    if (schema.type === "list")
        return (vs as Array<InputResult<ArrayItem<T>>>).map(
            (v: any, index: number) => inputStateToResult(schema.field, v, e => attachError({ ...e, index })) as T
        )
    if (schema.type === "collection")
        return (vs as Array<InputResult<ArrayItem<T>>>).map((v: any, index: number) =>
            formResultToResultRaw(schema.fields, v, e => attachError({ ...e, index }))
        )
    const res: Result<T> = vs as any
    if (res.type === "Err") {
        attachError(res)
        return null as any
    }
    return res.value
}

export const InputState = <T>(
    defValue: T,
    value: T,
    active: boolean = false,
    visited: boolean = false
): InputState<T> => ({
    value: isEmpty(value) ? defValue : value,
    active,
    visited
})

export function toInputState<T>(s: CollectionInputSchema<T>, value: T): Array<FormState<ArrayItem<T>>>
export function toInputState<T>(s: ListInputSchema<T>, value: T[]): Array<InputState<T>>
export function toInputState<T>(s: ChipsInputSchema<T>, value: T[]): InputState<T[]>
export function toInputState<T>(s: SimpleInputSchema<T>, value: T): InputState<T>
export function toInputState<T>(
    schema: InputSchema<T>,
    value: T | T[]
): InputState<T> | InputState<string[]> | Array<InputState<T>> | Array<FormState<ArrayItem<T>>> {
    switch (schema.type) {
        case "collection":
            return (((value || []) as any) as Array<ArrayItem<T>>).map(v => toFormState<ArrayItem<T>>(schema.fields, v))
        case "list":
            return arrify(isEmpty(value) ? [] : value).map(v => InputState<T>("" as any, v))
        case "chips":
        case "selectableChips":
            return InputState<string[]>([], value as any)
        case "radio":
            return InputState<T>("" as any, (value as any).toString())
        case "dropdown":
        case "text":
        case "textarea":
        case "email":
        case "password":
            return InputState<T>("" as any, value as T)
        case "number":
            return InputState<T>(undefined as any, value as T)
    }
}

export type InputPropsBase<TState, TSchema, TDelta> = {
    state: TState
    schema: TSchema
    setDelta: TDelta
}

export type InputProps<T> = InputPropsBase<InputState<T>, SimpleInputSchema<T>, F1<Partial<InputState<T>>>>

export const getInputProps = <T, T2 = HTMLInputElement>({ state, schema, setDelta }: InputProps<T>) => {
    const validate = (value: T) => {
        let displayedValue = value
        if (schema.toValue) {
            displayedValue = schema.toValue(`${value}`) as T
        } else if (schema.type === "number") {
            if ((value as any) === "") displayedValue = undefined as any
            if (((value as any) as string).endsWith(".") || ((value as any) as string).endsWith(","))
                displayedValue = value
            else {
                const numberValue = parseFloat(value as any) as any
                displayedValue = isNaN(numberValue) ? displayedValue : numberValue
            }
        }

        const validationResult = schema.validators
            ? runValidatorsRaw<T, string>(schema.validators, displayedValue)
            : Ok(displayedValue)

        setDelta({ ...state, validationResult, value: displayedValue })
        return validationResult
    }
    return {
        id: schema.name,
        value: state.value === undefined ? "" : state.value,
        // value: state.value,
        disabled: (schema as InputBoxSchema<T>).disabled || false,
        placeholder: (schema as InputBoxSchema<T>).placeholder || "",
        onChange: (e: React.ChangeEvent<T2>) => validate(e.target ? ((e as any).target.value as any) : null),
        onFocus: () => setDelta({ ...state, active: true }),
        onBlur: () => setDelta({ ...state, active: false, visited: true })
    }
}

export type DropdownInputProps<T> = InputPropsBase<InputState<T>, InputOptionSchema<T>, F1<any>>

export const getDropdownInputProps = <T>({ state, schema, setDelta }: DropdownInputProps<T>) => {
    const currentValue = schema.values.find(v => v[1] === state.value)
    const validate = (v: T) => (schema.validators ? runValidatorsRaw<T, string>(schema.validators, v) : Ok(v))
    const options = schema.values.map(v => toOption(v[0], v[1]))
    const onSelect = (o: Option<T>) =>
        setDelta({ ...state, validationResult: validate(o.value), value: o.value, visited: true })
    return {
        selected: currentValue ? [toOption(currentValue[0], currentValue[1])] : [],
        options,
        onSelect
    }
}
