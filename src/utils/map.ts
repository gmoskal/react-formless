export const setPromiseTimeout = <T>(cb: F0<T>, ms: number): Promise<T> =>
    new Promise(async (res: F1<T>) => setTimeout(() => res(cb()), ms))

export const asyncForEach = async <T, S>(vs: T[], cb: (val: T, i: number) => Promise<S>, delay: number = 0) => {
    for (let i = 0; i < vs.length; i++) {
        await usleep(delay)
        await cb(vs[i], i)
    }
}

export const isKeyOf = <T, TK extends keyof T>(key: TK | string, v: T): key is TK => keys(v).includes(key as any)

export const keys = <T>(t: T): Array<keyof T> => (t && typeof t === "object" ? (Object.keys(t) as any) : [])
export const values = <T>(t: T) => keys(t || (({} as any) as T)).map(k => t[k])

export const iterateMap = <T>(map: SMap<T>, cb: (key: keyof SMap<T>, v: T, index: number) => void) =>
    keys(map).forEach((key, index) => cb(key, map[key], index))

export const mapOn = <T, TV2 extends Casted<T, any>>(
    o: T,
    toValue: <TKey extends keyof T>(key: TKey, value: T[TKey]) => TV2[TKey]
) => keys(o).map(k => toValue(k, o[k]))

export const mapOn2 = <T, T2, TV2 extends Casted<T, any>>(
    o: T,
    toValue: <TKey extends keyof T>(key: TKey, value: T[TKey]) => T2,
    toValue2: <TKey extends keyof T>(key: string, value: T2) => TV2[TKey]
) => keys(o).map(k => toValue2(k + "", toValue(k, o[k])))

export const mapObject = <T, TV2 extends Casted<T, any>>(
    o: T,
    toValue: <TKey extends keyof T>(key: TKey, value: T[TKey]) => TV2[TKey]
): TV2 => {
    const res: TV2 = {} as any
    keys(o).forEach(k => (res[k] = toValue(k, o[k])))
    return res
}
export const usleep = (ms = 1000) => new Promise(resolve => setTimeout(() => resolve(), ms))

export const asyncMap = async <T, S>(vs: T[], cb: (val: T, i: number) => Promise<S>, delay: number = 0) => {
    for (let i = 0; i < vs.length; i++) {
        await usleep(delay)
        await cb(vs[i], i)
    }
}
export const asyncMapObject = async <T, TV2 extends Casted<T, any>>(
    o: T,
    toValue: <TKey extends keyof T>(key: TKey, value: T[TKey]) => Promise<TV2[TKey]>
): Promise<TV2> => {
    const res: TV2 = {} as any
    await asyncForEach(keys(o), async k => (res[k] = await toValue(k, o[k])))
    return res
}

export const remap = <T, S = any>(
    vs: SMap<T>,
    getKey: F3<string, T, number, string>,
    getValue: F3<T, string, number, S>,
    skipNullValue = false
): SMap<S> => {
    if (!vs) return {} as any
    const res: SMap<S> = {} as any
    keys(vs).forEach((k, index) => {
        const value = getValue(vs[k], k, index)
        if (!skipNullValue || value !== null) res[getKey(k, vs[k], index)] = value
    })
    return res
}

export const groupBy = <T, T2 = T>(ts: T[], toKey: F2<T, number, string>, toValue: F1<T, T2>): SMap<T2[]> => {
    const res: SMap<T2[]> = {}
    ;(ts || []).forEach((t, index) => {
        const key = toKey(t, index)
        if (!res[key]) res[key] = []
        res[key].push(toValue(t))
    })
    return res
}
type MapOptions = { skipNullKeys?: boolean; skipNullValues?: boolean }
export const toMap = <T, T2 = T>(
    ts: T[],
    toKey: F2<T, number, string | null>,
    toValue: F1<T, T2>,
    options: MapOptions = {}
): SMap<T2> => {
    const res: SMap<T2> = {}
    ;(ts || []).forEach((t, index) => {
        const k = toKey(t, index)
        const v = toValue(t)
        if (options.skipNullKeys && k === null) return
        if (options.skipNullValues && v === null) return
        res[k!] = v
    })
    return res
}

export const filterObject = <T>(o: SMap<T>, condition: (key: keyof typeof o, value: T) => boolean): SMap<T> => {
    const result: SMap<T> = {}
    const f = (field: string) => {
        if (condition(field, o[field])) result[field] = o[field]
    }
    Object.keys(o || {}).forEach(f)
    return result
}

export const copyDefinedFields = <T, V extends T>(keysSrc: Casted<T, any>, src: V, delta: Partial<T> = {}): T => {
    const res: T = {} as any
    keys(keysSrc).forEach(k => (res[k] = src[k]))
    return { ...res, ...delta }
}

export const toArray = <T, T2 = T>(
    map: SMap<T>,
    toValue: (t: T, key: keyof T, index: number) => T2 = v => (v as any) as T2
) => {
    const result: T2[] = []
    Object.keys(map || {}).forEach((field, index) => result.push(toValue(map[field], field as keyof T, index)))
    return result
}

export const extend = <T>(o: T) => (delta: Partial<T>): T => ({ ...o, ...delta })
export const extMap = <T, _ = any>(vs: SMap<T>, id: string, v: T) => ({ ...vs, [id]: v })

export const factory = <T>(defaults: T) => (params: Partial<T> = {}) =>
    (({ ...(defaults as any), ...(params as any) } as any) as T)

export const toRegExp = (query: string): RegExp => {
    try {
        return new RegExp("^" + query)
    } catch (e) {
        return new RegExp(query.replace(/^[.*+?^${}()|[\]\\]/g, "\\$&"))
    }
}

export const joinArrays = <T>(arr1: T[], arr2: T[], compare: (a: T, b: T) => boolean = (a, b) => a === b): T[] => {
    const res: T[] = [...arr1]
    arr2.forEach(a2 => {
        if (!arr1.find(a1 => compare(a1, a2))) res.push(a2)
    })
    return res
}

const isArray = <T>(v: any | T[]): v is T[] => Array.isArray(v)
export const flatten = <T>(vs: Array<T | T[]>, depth = 2, filter: (v: T | T[]) => boolean = _ => true): T[] =>
    vs.reduce(
        (acc: any, toFlatten) =>
            isArray(toFlatten) && depth - 1 > 0
                ? acc.concat(flatten(toFlatten, depth - 1, filter))
                : acc.concat(isArray(toFlatten) ? toFlatten : filter(toFlatten) ? [toFlatten] : []),
        [] as T[]
    )

export const replace = <T>(vs: T[], index: number, v: T): T[] => {
    if (!vs || index >= vs.length || index < 0) return vs
    const cp = [...vs]
    cp[index] = v
    return cp
}

export const arrify = <T>(ts: T[] | T): T[] => (Array.isArray(ts) ? ts : [ts])

export const match = <T>(cond: F1<T, boolean>) => (map: SMap<T>): T | null => values(map).find(cond) || null

export const matchOnValue = <T>(fname: keyof T) => (map: SMap<T>, v: T[typeof fname]): T | null =>
    match<T>(e => e[fname] === v)(map)

export const pickObject = <T, K extends keyof T>(source: T, keysToPick: K[]): Pick<T, K> => {
    const res: Pick<T, K> = {} as any
    keysToPick.forEach(k => (res[k] = source[k]))
    return res
}

export const omitObject = <T, K extends keyof T>(source: T, keysToOmit: K[]): Omit<T, K> => {
    const res: T = {} as any
    ;(keys(source) as K[]).filter(k => !keysToOmit.includes(k)).forEach(k => (res[k] = source[k]))
    return res
}

export const pickIntersect = <T2>() => <T, K extends keyof Intersect<T, T2>>(source: T, keysToPick: K[]) =>
    pickObject(source, keysToPick)

export const relativeComplement = <T>(a1: T[], a2: T[]) => a1.filter(id => !a2.includes(id))
