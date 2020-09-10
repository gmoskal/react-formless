import {
    mapObject,
    arrify,
    toOption,
    Option,
    F1,
    Result,
    mkOk,
    mkErr,
    isEmpty,
    ArrayItem,
    runValidatorsRaw,
    toMap,
    Err,
    ValueOf,
    keys,
    Validators,
    pickObject
} from "@react-formless/utils"

import {
    FormSchema,
    FormState,
    InputSchema,
    FormResult,
    CollectionInputSchema,
    InputResult,
    SimpleInputSchema,
    ListInputSchema,
    SimpleInputProps,
    ExtInputProps,
    InputOptionSchema,
    InputPropsBase,
    InputState,
    FormLeafState,
    MultiselectInputSchema,
    RenderParams,
    InputMultiselectRenderFn,
    InputOptionRenderFn,
    InputBoxRenderFn
} from "."

export const validateForm = <T>(schema: FormSchema<T>, state: FormState<T>): FormState<T> =>
    mapObject(schema, (k, s: InputSchema<any>) => validateInput(s as any, (state as any)[k]) as any)

const runValidatorsOnInputValue = <T>(value: T, validators?: Validators<T, string>) =>
    validators ? runValidatorsRaw<any, string>(validators, value) : mkOk(value)

function validateInput<T>(
    schema: InputSchema<T>,
    state: InputState<T> | InputState<T[]> | Array<FormState<ArrayItem<T>>>
): InputState<T> | InputState<T[]> | Array<InputState<T>> | Array<FormState<ArrayItem<T>>> {
    switch (schema.type) {
        case "collection":
            return arrify(state as any[]).map(v => validateForm(schema.fields, v) as FormState<ArrayItem<T>>)
        case "list":
            return arrify(state as any[]).map(v => validateInput(schema.field, v) as InputState<T>)
        default:
            const s = state as InputState<T>
            const validationResult = runValidatorsOnInputValue(s.value, schema.validators)
            return { ...s, visited: true, validationResult }
    }
}

export const formStateToFormResult = <T>(schema: FormSchema<T>, state: FormState<T>): FormResult<T> =>
    mapObject(schema, (k, s: InputSchema<any>) => inputStateToInputResult(s as any, (state as any)[k]) as any)

function inputStateToInputResult<T>(s: CollectionInputSchema<T>, state: Array<FormState<ArrayItem<T>>>): InputResult<T>
function inputStateToInputResult<T>(s: MultiselectInputSchema<T>, state: InputState<T[]>): Result<T[], string>
function inputStateToInputResult<T>(s: SimpleInputSchema<T>, state: InputState<T>): Result<T, string>
function inputStateToInputResult<T>(
    schema: InputSchema<T>,
    state: InputState<T> | Array<FormState<ArrayItem<T>>>
): Result<T, string> | Array<{ [K in keyof T]: Result<T, string> }> {
    switch (schema.type) {
        case "collection":
            return arrify(state as any[]).map(v => formStateToFormResult(schema.fields, v) as any)
        case "list":
            return arrify(state as any[]).map(v => inputStateToInputResult(schema.field, v) as any)
        default: {
            const s = state as InputState<T>
            if ((s.visited || s.active) && s.validationResult) return s.validationResult

            const value = schema.toValue ? schema.toValue((state as any).value) : (state as any).value
            return runValidatorsOnInputValue(value, schema.validators)
        }
    }
}

export const toResult = <T>(schema: FormSchema<T>, state: FormState<T>): Result<T, T> => {
    const res = formStateToFormResult(schema, state)
    return formResultToResult(schema, res)
}

export const formResultToResult = <T>(schema: FormSchema<T>, res: FormResult<T>): Result<T, T> => {
    const errors: (Err<ValueOf<T>> & { key: string })[] = []
    const maybeT = formResultToResultRaw(schema, res, e => errors.push(e))
    const errorsMap = toMap(
        errors,
        v => v.key,
        v => v.value
    ) as any
    return errors.length ? mkErr(errorsMap, maybeT) : mkOk((maybeT as any) as T)
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
    if (schema.type === "collection") {
        return (vs as Array<InputResult<ArrayItem<T>>>).map((v: any, index: number) =>
            formResultToResultRaw(schema.fields, v, e => attachError({ ...e, index }))
        )
    }
    const res: Result<T> = vs as any
    if (res.type === "Err") {
        attachError(res)
        return res.obj
    }
    return res.value
}

export const toFormState = <T>(schema: FormSchema<T>, value: T): FormState<T> =>
    mapObject(
        schema,
        (k, s: InputSchema<any>) => toInputState(s as any, s.fromValue ? s.fromValue(value[k] as any) : value[k]) as any
    )

export const mkInputState = <T>(defValue: T, value: T, active = false, visited = false): InputState<T> => ({
    value: isEmpty(value) ? defValue : value,
    active,
    visited
})

export const mkHiddenInputState = <T>(value: T): InputState<T> => ({ value, active: false, visited: true })

export function toInputState<T>(s: CollectionInputSchema<T>, value: T): Array<FormState<ArrayItem<T>>>
export function toInputState<T>(s: ListInputSchema<T>, value: T[]): Array<InputState<T>>
export function toInputState<T>(s: MultiselectInputSchema<T>, value: T[]): InputState<T[]>
export function toInputState<T>(s: SimpleInputSchema<T>, value: T): InputState<T>
export function toInputState<T>(
    schema: InputSchema<T>,
    value: T | T[]
): InputState<T> | InputState<T[]> | Array<InputState<T>> | Array<FormState<ArrayItem<T>>> {
    switch (schema.type) {
        case "collection":
            return (((value || []) as any) as Array<ArrayItem<T>>).map(v => toFormState<ArrayItem<T>>(schema.fields, v))
        case "list":
            return arrify(isEmpty(value) ? [] : value).map(v => mkInputState<T>("" as any, v))
        case "radio":
            return mkInputState<T>("" as any, `${value}` as any)
        case "hidden":
            return mkHiddenInputState(value as T)
        case "multiselect":
            return mkInputState<T[]>([], arrify(value))
        case "customBox":
        case "select":
        case "text":
        case "customOption":
        case "textarea":
        case "email":
        case "password":
            return mkInputState<T>("" as any, value as T)
        case "number":
            return mkInputState<T>(undefined as any, value as T)
    }
}

const getNumberValue = (v: any): any => {
    if (`${v}` === "") return undefined as any
    if (`${v}`.endsWith(".") || `${v}`.endsWith(",")) return v
    const numberValue = parseFloat(v as any)
    return isNaN(numberValue) ? v : numberValue
}

export const validate = <T>({ state, schema: { toValue, type, validators }, setDelta }: SimpleInputProps, v: any) => {
    const value = toValue ? toValue(v) : type === "number" ? getNumberValue(v) : v
    const validationResult = validators ? runValidatorsRaw<T, string>(validators, value) : mkOk(value)
    setDelta({ ...state, validationResult, value })
    return validationResult
}

const get = <T>(v: Partial<T>, field: keyof T) => (v[field] !== undefined ? { [field]: v[field] } : {})

export const getInputProps = <T2 = HTMLInputElement>(p: SimpleInputProps): ExtInputProps<T2> => ({
    ...get(p.schema, "name"),
    ...get(p.schema, "id"),
    ...get(p.schema, "placeholder"),
    value: (p.state.value === undefined || p.state.value === null ? "" : p.state.value) as any,
    disabled: p.schema.disabled || false,
    onChange: e => validate(p, (e as any).target.value || null),
    onFocus: () => p.setDelta({ ...p.state, active: true }),
    onBlur: () => p.setDelta({ ...p.state, active: false, visited: true })
})

export const getExtInputProps = <T>(
    p: RenderParams<InputBoxRenderFn<T> | InputOptionRenderFn<T> | InputMultiselectRenderFn<T>>
) => ({
    ...pickObject(p.schema, ["name", "id", "placeholder"]),
    value: p.state.value,
    disabled: p.schema.disabled || false,
    onChange: (v: typeof p.state.value) => validate(p, v || null),
    onFocus: () => p.setDelta({ ...p.state, active: true } as any),
    onBlur: () => p.setDelta({ ...p.state, active: false, visited: true } as any)
})

export const getDropdownInputProps = <T>({
    state,
    schema,
    setDelta
}: InputPropsBase<InputOptionSchema<T>, InputState<T>>) => {
    const currentValue = schema.values.find(v => v[1] === state.value)
    const runValidation = (v: T) => (schema.validators ? runValidatorsRaw<T, string>(schema.validators, v) : mkOk(v))
    const options = schema.values.map(v => toOption(v[0], v[1]))
    const onSelect = (o: Option<T>) =>
        setDelta({
            ...state,
            validationResult: runValidation(o.value) as Result<T, string>,
            value: o.value,
            visited: true
        })
    return {
        selected: currentValue ? [toOption(currentValue[0], currentValue[1])] : [],
        options,
        onSelect
    }
}

const isInputActive = <T>(schema: InputSchema<T>, state: FormLeafState<T>): boolean => {
    if (schema.type === "collection")
        return (state as Array<FormState<any>>).some(st => isFormActive(schema.fields, st))
    if (schema.type === "list") return (state as Array<any>).some(st => isInputActive(schema.field, st))

    return (state as InputState<T>).active
}

export const isFormActive = <T>(schema: FormSchema<T>, state: FormState<T>): boolean =>
    keys(schema).some(key => isInputActive(schema[key], state[key]))
