export const Nothing = (): Nothing => ({ type: "Nothing" })
export const Just = <T>(value: T): Just<T> => ({ type: "Just", value })
export const equal = <T>(l: Maybe<T>, r: Maybe<T>) =>
    l.type === r.type && l.type === "Just" && r.type === "Just" && l.value === r.value

export const Fetched = <T>(value: T): AsyncFetched<T> => ({ type: "Fetched", value })
export const NotFetched = (): AsyncNotFetched => ({ type: "NotFetched" })
export const Fetching = (): AsyncFetching => ({ type: "Fetching" })
export const FetchError = (value: string): AsyncFetchError => ({ type: "FetchError", value })

export const isJust = <T>(v: any): v is Just<T> => v && v.type === "Just"
export const isNothing = (v: any): v is Nothing => v && v.type === "Nothing"

export const Maybe = <T>(v?: T): Maybe<T> => (v !== undefined && v !== null ? Just(v) : Nothing())

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
