export type F0<RT = void> = () => RT
export type F1<T, RT = void> = (arg: T) => RT
export type AF0<RT = void> = () => RT | Promise<RT>
export type AF1<T, RT = void> = (arg: T) => RT | Promise<RT>
export type F2<T, T2, RT = void> = (arg1: T, arg2: T2) => RT
export type F3<T, T2, T3, RT = void> = (arg1: T, arg2: T2, arg3: T3) => RT
export type FArgs<T extends Function> = T extends (...args: infer U) => any ? U : never
export type FMapped<T extends Function, TReturnValue> = (...a: FArgs<T>) => TReturnValue
export type Merged<T, M extends SCasted<T, any>> = { [P in keyof T]: P extends keyof M ? M[P] : T[P] }
export type Extended<T, M, K extends keyof T> = { [P in keyof Omit<T, K>]: P extends keyof M ? M[P] : T[P] } &
    Pick<M, Exclude<keyof M, keyof T>>
export type Overwrite<T, O extends Casted<T, any>> = O
export type SimpleValue = boolean | string | number
export type Datum<T extends string | number = string> = { e: T; a: string; v: SimpleValue; tx: number; op?: boolean }
export type EidDatum = Datum<number>
export type UuidDatum = Datum<string>
export type SDict<Keys extends string | number | symbol, S> = Partial<Dict<Keys, S>>
export type Dict<Keys extends string | number | symbol, S> = { [P in Keys]: S }
export type Casted<T, S> = Dict<keyof T, S>
export type Subtype<T> = Dict<keyof T, T[keyof T]>
export type SCasted<T, S> = SDict<keyof T, S>
export type StateType<T> = T extends State<infer E> ? E : T
export type State<T extends string, T2 = {}> = { type: T } & T2
export type ValueState<T extends string, T2> = State<T, { value: T2 }>
export type ErrorState<T extends string, T2 = string> = State<T, { error: T2 }>
export type Loaded<T> = T & { loading: false }
export type Loadable<T> = { loading: true } | Loaded<T>
export type Nothing = State<"Nothing">
export type Just<T> = ValueState<"Just", T>
export type Maybe<T> = Just<T> | Nothing
export type AsyncNotFetched = State<"NotFetched">
export type AsyncFetching = State<"Fetching">
export type AsyncFetched<T> = ValueState<"Fetched", T>
export type AsyncFetchError = ValueState<"FetchError", string>
export type Async<T> = AsyncNotFetched | AsyncFetching | AsyncFetched<T> | AsyncFetchError
export type AsyncType<T> = T extends Async<infer E> ? E : never
export type AsyncAction<T> = State<"NotStarted" | "Processing"> | ValueState<"Done", T>
export type Option<T = string> = { label: string; value: T }
export type ROption<T = {}> = { label: string; value: string } & T
export type ROptions<T = {}> = Array<ROption<T>>
export type Brand<T, TBrand> = T & { __brand: TBrand }
export type ValueOf<T> = T[keyof T]
export type Optionalize<T, K extends keyof T> = { [P in K]?: T[P] } & Pick<T, Exclude<keyof T, K>>
export type Displayable<T> = Required<Casted<T, string>>
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
export type KeysWithValue<TSource, TBase> = Exclude<
    keyof Pick<TSource, { [P in keyof TSource]: TSource[P] extends TBase | undefined ? P : never }[keyof TSource]>,
    undefined
>
export type ArrayItem<T> = T extends Array<infer E> ? E : T
export type Intersect<T, T2> = Pick<T, Extract<keyof T, keyof T2>>
// Makes any properties included in Default optional
export type Defaultize<Props, Defaults> = Partial<Pick<Props, Extract<keyof Props, keyof Defaults>>> &
    Pick<Props, Exclude<keyof Props, keyof Defaults>>

export const mkNothing = (): Nothing => ({ type: "Nothing" })
export const mkJust = <T>(value: T): Just<T> => ({ type: "Just", value })
export const equal = <T>(l: Maybe<T>, r: Maybe<T>) =>
    l.type === r.type && l.type === "Just" && r.type === "Just" && l.value === r.value

export const mkFetched = <T>(value: T): AsyncFetched<T> => ({ type: "Fetched", value })
export const mkNotFetched = (): AsyncNotFetched => ({ type: "NotFetched" })
export const mkFetching = (): AsyncFetching => ({ type: "Fetching" })
export const mkFetchError = (value: string): AsyncFetchError => ({ type: "FetchError", value })

export const isJust = <T>(v: any): v is Just<T> => v && v.type === "Just"
export const isNothing = (v: any): v is Nothing => v && v.type === "Nothing"

export const mkMaybe = <T>(v?: T): Maybe<T> => (v !== undefined && v !== null ? mkJust(v) : mkNothing())

export const isNotFetched = (v: any): v is AsyncNotFetched => !v || v.type === "NotFetched"

export const isFetched = <T>(v: Async<T> | undefined): v is AsyncFetchError | AsyncFetched<T> =>
    Boolean(v && (v.type === "Fetched" || v.type === "FetchError"))

export const isFetchedSuccessfully = <T>(v: Async<T> | undefined): v is AsyncFetched<T> =>
    Boolean(v && v.type === "Fetched")

export const toOption = <T, _>(label: string, value: T): Option<T> => ({ label, value })

export const toROption = (label: string, value?: string): ROption => ({
    label,
    value: value || label.toLocaleLowerCase().replace(/\W/g, "")
})
export const toROptions = (tags?: string[]) => (tags || []).map(t => toROption(t))
