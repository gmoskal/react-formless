import { iterateMap, keys, copyDefinedFields } from "./map"
import { Nothing, Just } from "./types"

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

export const Err = <T>(error: T, obj: any = {}): Err<T> => ({ type: "Err", value: error, obj })
export const Ok = <T>(value: T): Ok<T> => ({ type: "Ok", value })

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
    isString(v) ? Ok(v) : Err(msg || errors.notStringType, v)

export const validateAZ = (v: any, msg?: string): Result<string, string> =>
    /^[a-zA-Z-_]*$/.test(v) ? Ok(v) : Err(msg || errors.notAllowed, v)

export const validateUppercasePresent = (v: any, msg?: string): Result<string, string> =>
    /^(?=.*[A-Z]).*/.test(v) ? Ok(v) : Err(msg || errors.noUppercasePresent)

export const validateLowercasePresent = (v: any, msg?: string): Result<string, string> =>
    /^(?=.*[a-z]).*/.test(v) ? Ok(v) : Err(msg || errors.noLowercasePresent)

export const validateNumberPresent = (v: any, msg?: string): Result<string, string> =>
    /^(?=.*\d).*/.test(v) ? Ok(v) : Err(msg || errors.noDigitPresent)

export const validateMinLength = (l: number) => (v: string, msg?: string): Result<string, string> =>
    v.length >= l ? Ok(v) : Err(msg || errors.minLenString + ` (${l})`, v)

export const validateEmpty = (v: any, msg?: string): Result<any, string> =>
    isEmpty(v) ? Ok(v) : Err(msg || errors.shouldBeEmpty, v)

export const validateNotEmpty = <T>(v: T, msg?: string): Result<T, string> =>
    !isEmpty(v) ? Ok(v) : Err(msg || errors.cannotBeEmpty, v)

export const validateMemberOf = <T>(vs: T[]) => (v: any, msg?: string): Result<any, string> =>
    vs.includes(v) ? Ok(v) : Err(msg || errors.notAllowed, v)

export const validateNotMemberOf = (vs: string[], msg: string): Validator<string> => v =>
    vs.includes(v) ? Err(msg || errors.notAllowed) : Ok(v)

export const validateNumber = (v: any, msg?: string): Result<number, string> =>
    isNumber(v) ? Ok(v) : Err(msg || errors.notNumberType, v)

export const validateEmail = (v: any, msg?: string): Result<string, string> =>
    isEmail(v) ? Ok(v) : Err(msg || errors.notValidEmail, v)

export const validateBoolean = (v: any, msg?: string): Result<boolean, string> =>
    isBoolean(v) ? Ok(v) : Err(msg || errors.notBooleanType, v)

export const validateHexColor = (v: any, msg?: string): Result<boolean, string> =>
    /^(#[0-9a-f]{3}|#[0-9a-f]{6})$/i.test(v) ? Ok(v) : Err(msg || errors.notHexColor, v)

export const runValidatorsRaw = <T = any, T2 = ExtErrors<T>>(
    validators: Validators<T, T2>,
    value: any
): Result<T, T2> =>
    (validators || []).reduce(
        (acc, validator) => (acc.type === "Err" ? acc : validator(acc.value)),
        Ok(value) as Result<T, T2>
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
    if (!o) return Err(errors.invalidObject, o)
    const maybe: T = o
    const errorsMap: Errors<T> = {}
    keys(validationMap).forEach(
        f => (maybe[f] = runValidators(validationMap[f], maybe[f], err => (errorsMap[f] = err)))
    )
    const defaultConstractor = () => copyDefinedFields(validationMap, maybe, delta ? delta(maybe) : {})
    return Object.keys(errorsMap).length ? Err(errorsMap, o) : Ok((constructor || defaultConstractor)(maybe))
}

export const validateMap = <T>(validators: Validators<T>) => (v: any, msg?: string): Result<T, string> => {
    if (!isObject(v) || !v) return Err(msg || errors.notObjectType, v)
    let err: Err<string> | null = null
    iterateMap(v, (k, kv) => runValidators(validators, kv, () => (err = Err(`invalid value ${kv}`, k))))
    return err || Ok(v)
}

export const validateArray = <T>(validators: Validators<T>) => (v: any, msg?: string): Result<T[], string> => {
    if (!isArray(v) || !v) return Err(msg || errors.notArrayType, v)
    const errMessages: string[] = []
    const maybe: T[] = v as T[]
    maybe.forEach((kv, i) =>
        runValidators(validators, kv, e => (errMessages[i] = `${kv} on index ${i} with error: ${e}`))
    )
    return errMessages.length ? Err(errMessages.join("; ")) : Ok(maybe)
}

export const optional = <T>(validator: Validator<T>): Validator<Maybe<T>> => (v: any, msg?: string) => {
    if (v === undefined || v === null) return Ok(Nothing())
    const result = validator(v, msg)
    return result.type === "Ok" ? Ok(Just(result.value)) : Err(Just(result.value), result.obj)
}

export const defualtV = <T>(def: T) => (validator: Validator<T>): Validator<T> => (v: any, msg?: string) =>
    v === undefined || v === null ? Ok(def) : validator(v, msg)

export const ensureString: Validator<string> = (v: any, msg?: string) => {
    return isString(v) ? Ok(v) : validateString(v.toString(10), msg)
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
