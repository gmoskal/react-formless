type Errors<T> = SCasted<T, string>
type ErrArray<T> = Array<Err<ExtErrors<T>>>

type ExtErrors<T> = Errors<T> | string
type OkType = "Ok"
type Ok<T> = ValueState<OkType, T>
type ErrType = "Err"
type Err<E, O = any> = ValueState<ErrType, E> & { obj: O }
type ResultType = OkType | ErrType
type Result<T, E = ExtErrors<T>> = Ok<T> | Err<E>
type Validator<T, E = ExtErrors<T>> = (o: any, msg?: string) => Result<T, E>

type Validators<T = any, T2 = ExtErrors<T>> = Array<Validator<any, T2>> | null
type ValidationMap<T> = { [key in keyof T]: Validators<T[key]> }
type ValidatedCollection<T, E = ExtErrors<T>> = { valid: SMap<T>; invalid: SMap<Err<E>> }

type IsType = (v: any, msg?: string) => null | string

type Value<T> = T extends ValueState<string, infer T2> ? T2 : never
type Type<T> = T extends State<infer T2> ? T2 : never
type Constructor<T> = (payload: Value<T>) => T
