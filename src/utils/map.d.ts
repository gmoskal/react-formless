type OMap<TKey extends string, TValue> = { [K in TKey]?: TValue }
type TMap<TKey extends string | number, TValue> = { [K in TKey]: TValue }
type SMap<TValue> = TMap<string, TValue>
type KMap<T> = TMap<string | number, T>
