type F0<RT = void> = () => RT
type F1<T, RT = void> = (arg: T) => RT
type AF0<RT = void> = () => RT | Promise<RT>
type AF1<T, RT = void> = (arg: T) => RT | Promise<RT>
type F2<T, T2, RT = void> = (arg1: T, arg2: T2) => RT
type F3<T, T2, T3, RT = void> = (arg1: T, arg2: T2, arg3: T3) => RT

type FArgs<T extends Function> = T extends (...args: infer U) => any ? U : never
type FMapped<T extends Function, TReturnValue> = (...a: FArgs<T>) => TReturnValue

type Merged<T, M extends SCasted<T, any>> = { [P in keyof T]: P extends keyof M ? M[P] : T[P] }
type Extended<T, M, K extends keyof T> = { [P in keyof Omit<T, K>]: P extends keyof M ? M[P] : T[P] } &
    Pick<M, Exclude<keyof M, keyof T>>
type Overwrite<T, O extends Casted<T, any>> = O

type SimpleValue = boolean | string | number
type Datum<T extends string | number = string> = { e: T; a: string; v: SimpleValue; tx: number; op?: boolean }
type EidDatum = Datum<number>
type UuidDatum = Datum<string>

type Casted<T, S> = { [P in keyof T]: S }
type Subtype<T> = { [P in keyof T]: T[keyof T] }
type SCasted<T, S> = { [P in keyof T]?: S }

type StateType<T> = T extends State<infer E> ? E : T
type State<T extends string, T2 = {}> = { type: T } & T2
type ValueState<T extends string, T2> = State<T, { value: T2 }>
type ErrorState<T extends string, T2 = string> = State<T, { error: T2 }>

type Loaded<T> = T & { loading: false }
type Loadable<T> = { loading: true } | Loaded<T>

type Nothing = State<"Nothing">
type Just<T> = ValueState<"Just", T>
type Maybe<T> = Just<T> | Nothing

type AsyncNotFetched = State<"NotFetched">
type AsyncFetching = State<"Fetching">
type AsyncFetched<T> = ValueState<"Fetched", T>
type AsyncFetchError = ValueState<"FetchError", string>

type Async<T> = AsyncNotFetched | AsyncFetching | AsyncFetched<T> | AsyncFetchError
type AsyncType<T> = T extends Async<infer E> ? E : never
type SAMap<T> = SMap<Async<T>>

type AsyncAction<T> = State<"NotStarted" | "Processing"> | ValueState<"Done", T>

type Option<T = string> = { label: string; value: T }
type ROption<T = {}> = { label: string; value: string } & T
type ROptions<T = {}> = Array<ROption<T>>
type Brand<T, TBrand> = T & { __brand: TBrand }
type ValueOf<T> = T[keyof T]
type Optionalize<T, K extends keyof T> = { [P in K]?: T[P] } & Pick<T, Exclude<keyof T, K>>
type Displayable<T> = Required<Casted<T, string>>
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }

type KeysWithValue<TSource, TBase> = Exclude<
    keyof Pick<TSource, { [P in keyof TSource]: TSource[P] extends TBase | undefined ? P : never }[keyof TSource]>,
    undefined
>

type Intersect<T, T2> = Pick<T, Extract<keyof T, keyof T2>>

// Makes any properties included in Default optional
type Defaultize<Props, Defaults> = Partial<Pick<Props, Extract<keyof Props, keyof Defaults>>> &
    Pick<Props, Exclude<keyof Props, keyof Defaults>>

type MutationTypeCreate = "create"
type MutationTypeDelete = "delete"
type MutationTypeUpdate = "update"
type MutationType = MutationTypeCreate | MutationTypeDelete | MutationTypeUpdate
