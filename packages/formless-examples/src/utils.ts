export type Dict<Keys extends string | number | symbol, S> = { [P in Keys]: S }
export type Casted<T, S> = Dict<keyof T, S>

export const keys = <T>(t: T): Array<keyof T> => (t && typeof t === "object" ? (Object.keys(t) as any) : [])

export const mapOn = <T, TV2 extends Casted<T, any>>(
    o: T,
    toValue: <TKey extends keyof T>(key: TKey, value: T[TKey]) => TV2[TKey]
) => keys(o).map(k => toValue(k, o[k]))
export const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1)
export const labelize = (s: string) => capitalize(`${s}`.toLocaleLowerCase())
