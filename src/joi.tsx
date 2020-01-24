import { Ok, Err } from "./utils/validators"

type JoiValidationResult<T = any> = { error: Error; value: T }
type JoiAnySchema<T> = { validate: (v: any) => JoiValidationResult<T> }
export const toValdator = <T, _ = any>(so: JoiAnySchema<T>): Validator<T, any> => {
    if (!so.validate) return Ok
    return (v: any) => {
        const res = so.validate(v)
        if (!res.error) return Ok(v as T)
        return Err(res.error, v)
    }
}
