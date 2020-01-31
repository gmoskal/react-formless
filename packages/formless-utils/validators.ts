import { iterateMap, keys, copyDefinedFields, SMap } from "./map"
import { mkNothing, mkJust, SCasted, ValueState, State, F1, Maybe } from "./types"

export type Errors<T> = SCasted<T, string>
export type ErrArray<T> = Array<Err<ExtErrors<T>>>
export type ExtErrors<T> = Errors<T> | string
export type OkType = "Ok"
export type Ok<T> = ValueState<OkType, T>
export type ErrType = "Err"
export type Err<E, O = any> = ValueState<ErrType, E> & { obj: O }
export type ResultType = OkType | ErrType
export type Result<T, E = ExtErrors<T>> = Ok<T> | Err<E>
export type Validator<T, E = ExtErrors<T>> = (o: any, msg?: string) => Result<T, E>
export type Validators<T = any, T2 = ExtErrors<T>> = Array<Validator<any, T2>> | null
export type ValidationMap<T> = { [key in keyof T]: Validators<T[key]> }
export type ValidatedCollection<T, E = ExtErrors<T>> = { valid: SMap<T>; invalid: SMap<Err<E>> }
export type IsType = (v: any, msg?: string) => null | string
export type Value<T> = T extends ValueState<string, infer T2> ? T2 : never
export type Type<T> = T extends State<infer T2> ? T2 : never
export type Constructor<T> = (payload: Value<T>) => T

export const isString = (v: any): v is string => typeof v === "string"
export const isObject = (v: any): v is Object => typeof v === "object"
export const isFunction = (f: any): f is Function => "function" === typeof f
export const isArray = <T>(ts: T[] | any): ts is T[] => ts && typeof ts === "object" && ts.constructor.name === "Array"
export const isValid = (pred: boolean | (() => boolean)) => (isFunction(pred) ? pred() : pred)
export const isNumber = (v: any): v is number => typeof v === "number"
export const isBoolean = (v: any): v is boolean => typeof v === "boolean"
export const isEmpty = (v: any) =>
    v === undefined || v === null || v === "" || JSON.stringify(v) === "{}" || JSON.stringify(v) === "[]"
export const isEmail = (email: any): email is string => isString(email) && /^.+@.+\..+$/.test(email)

export const mkErr = <T>(error: T, obj: any = {}): Err<T> => ({ type: "Err", value: error, obj })
export const mkOk = <T>(value: T): Ok<T> => ({ type: "Ok", value })

export const isErr = <T>(v: any): v is Err<T> => v && v.type === "Err"
export const isOk = <T>(v: any): v is Ok<T> => v && v.type === "Ok"

export const errors = {
    notFetched: "Not fetched",
    notFound: "Not found",
    notStringType: "Not a string type",
    notObjectType: "Not an object type",
    notNumberType: "Not a number type",
    notArrayType: "Not an array type",
    notBooleanType: "Not an boolean type",
    cannotBeEmpty: "Cannot be empty",
    shouldBeEmpty: "Should be empty",
    notAllowed: "Value not allowed",
    invalidDocument: "Invalid document",
    invalidObject: "Invalid object",
    duplicated: "Duplicated",
    notValidEmail: "Not a valid email",
    minLenString: "Value is too short",
    notMatchingValues: "Values are not the same",
    noUppercasePresent: "No uppercase character present",
    noLowercasePresent: "No lowercase character present",
    noDigitPresent: "No digit character present",
    notHexColor: "Invalid hex color",
    notEncryptionKey: "Invalid encryption key type"
}

export const validateString = (v: any, msg?: string): Result<string, string> =>
    isString(v) ? mkOk(v) : mkErr(msg || errors.notStringType, v)

export const validateAZ = (v: any, msg?: string): Result<string, string> =>
    /^[a-zA-Z-_]*$/.test(v) ? mkOk(v) : mkErr(msg || errors.notAllowed, v)

export const validateUppercasePresent = (v: any, msg?: string): Result<string, string> =>
    /^(?=.*[A-Z]).*/.test(v) ? mkOk(v) : mkErr(msg || errors.noUppercasePresent)

export const validateLowercasePresent = (v: any, msg?: string): Result<string, string> =>
    /^(?=.*[a-z]).*/.test(v) ? mkOk(v) : mkErr(msg || errors.noLowercasePresent)

export const validateNumberPresent = (v: any, msg?: string): Result<string, string> =>
    /^(?=.*\d).*/.test(v) ? mkOk(v) : mkErr(msg || errors.noDigitPresent)

export const validateMinLength = (l: number) => (v: string, msg?: string): Result<string, string> =>
    v.length >= l ? mkOk(v) : mkErr(msg || errors.minLenString + ` (${l})`, v)

export const validateEmpty = (v: any, msg?: string): Result<any, string> =>
    isEmpty(v) ? mkOk(v) : mkErr(msg || errors.shouldBeEmpty, v)

export const validateNotEmpty = <T>(v: T, msg?: string): Result<T, string> =>
    !isEmpty(v) ? mkOk(v) : mkErr(msg || errors.cannotBeEmpty, v)

export const validateMemberOf = <T>(vs: T[]) => (v: any, msg?: string): Result<any, string> =>
    vs.includes(v) ? mkOk(v) : mkErr(msg || errors.notAllowed, v)

export const validateNotMemberOf = (vs: string[], msg: string): Validator<string> => v =>
    vs.includes(v) ? mkErr(msg || errors.notAllowed) : mkOk(v)

export const validateNumber = (v: any, msg?: string): Result<number, string> =>
    isNumber(v) ? mkOk(v) : mkErr(msg || errors.notNumberType, v)

export const validateEmail = (v: any, msg?: string): Result<string, string> =>
    isEmail(v) ? mkOk(v) : mkErr(msg || errors.notValidEmail, v)

export const validateBoolean = (v: any, msg?: string): Result<boolean, string> =>
    isBoolean(v) ? mkOk(v) : mkErr(msg || errors.notBooleanType, v)

export const validateHexColor = (v: any, msg?: string): Result<boolean, string> =>
    /^(#[0-9a-f]{3}|#[0-9a-f]{6})$/i.test(v) ? mkOk(v) : mkErr(msg || errors.notHexColor, v)

export const runValidatorsRaw = <T = any, T2 = ExtErrors<T>>(
    validators: Validators<T, T2>,
    value: any
): Result<T, T2> =>
    (validators || []).reduce(
        (acc, validator) => (acc.type === "Err" ? acc : validator(acc.value)),
        mkOk(value) as Result<T, T2>
    )

export const runValidators = <T = any>(validators: Validators<T>, value: any, cb: (err: string) => void) => {
    const res = runValidatorsRaw<T>(validators, value)
    if (res.type === "Err") {
        cb(res.value as string)
        return value
    }
    return res.value
}

export const validate = <T>(
    validationMap: ValidationMap<Required<T>>,
    constructor?: F1<any, T>,
    delta?: (o: T) => Partial<T>
): Validator<T> => (o: any) => {
    if (!o) return mkErr(errors.invalidObject, o)
    const maybe: T = o
    const errorsMap: Errors<T> = {}
    keys(validationMap).forEach(
        f => (maybe[f] = runValidators(validationMap[f], maybe[f], err => (errorsMap[f] = err)))
    )
    const defaultConstractor = () => copyDefinedFields(validationMap, maybe, delta ? delta(maybe) : {})
    return Object.keys(errorsMap).length ? mkErr(errorsMap, o) : mkOk((constructor || defaultConstractor)(maybe))
}

export const validateMap = <T>(validators: Validators<T>) => (v: any, msg?: string): Result<T, string> => {
    if (!isObject(v) || !v) return mkErr(msg || errors.notObjectType, v)
    let err: Err<string> | null = null
    iterateMap(v, (k, kv) => runValidators(validators, kv, () => (err = mkErr(`invalid value ${kv}`, k))))
    return err || mkOk(v)
}

export const validateArray = <T>(validators: Validators<T>) => (v: any, msg?: string): Result<T[], string> => {
    if (!isArray(v) || !v) return mkErr(msg || errors.notArrayType, v)
    const errMessages: string[] = []
    const maybe: T[] = v as T[]
    maybe.forEach((kv, i) =>
        runValidators(validators, kv, e => (errMessages[i] = `${kv} on index ${i} with error: ${e}`))
    )
    return errMessages.length ? mkErr(errMessages.join("; ")) : mkOk(maybe)
}

export const optional = <T>(validator: Validator<T>): Validator<Maybe<T>> => (v: any, msg?: string) => {
    if (v === undefined || v === null) return mkOk(mkNothing())
    const result = validator(v, msg)
    return result.type === "Ok" ? mkOk(mkJust(result.value)) : mkErr(mkJust(result.value), result.obj)
}

export const defualtV = <T>(def: T) => (validator: Validator<T>): Validator<T> => (v: any, msg?: string) =>
    v === undefined || v === null ? mkOk(def) : validator(v, msg)

export const ensureString: Validator<string> = (v: any, msg?: string) => {
    return isString(v) ? mkOk(v) : validateString(v.toString(10), msg)
}
export const validateCollection = <T, S = T>(collection: SMap<T>, validator: Validator<S>): ValidatedCollection<S> => {
    const valid: SMap<S> = {}
    const invalid: SMap<Err<ExtErrors<S>>> = {}

    iterateMap(collection, (k, val) => {
        const result = validator(val)
        if (result.type === "Err") invalid[k] = result
        else valid[k] = result.value
    })

    return { valid, invalid }
}

export const validNumber = [validateNumber, validateNotEmpty]
export const validString = [validateString, validateNotEmpty]
export const validEmail = [validateEmail]
export const validBoolean = [validateBoolean]
export const validArrayString = [validateArray(validString)]
export const validPassword = [
    validateString,
    validateNotEmpty,
    validateMinLength(8),
    validateUppercasePresent,
    validateNumberPresent
]

export const validDef = <T>(def: T, v: Validator<T>) => [defualtV(def)(v)]
export const validNumberDef = validDef(0, validateNumber)
export const validStringDef = validDef("", validateString)
export const validBooleanDef = validDef(false, validateBoolean)

export const validArrayDef = <T>(vs: Array<Validator<T>>) => [(v: any, m?: string) => validateArray(vs)(v || [], m)]
export const validArrayStringDef = validArrayDef(validString)

export const validMapDef = <T>(vs: Array<Validator<T>>) => [(v: any, m?: string) => validateMap(vs)(v || {}, m)]

export const validators = { validNumber, validString, validEmail, validBoolean, validArrayString, Ok: mkOk, Err: mkErr }
export const guards = {
    isString,
    isObject,
    isFunction,
    isArray,
    isValid,
    isNumber,
    isBoolean,
    isEmpty,
    isEmail,
    isOk,
    isErr
}
