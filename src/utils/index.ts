export const _noop = (): any => undefined
export const _anything: any = {}
export const createDiv = (id: string) => {
    const d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}
export const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1)
export const labelize = (s: string) => capitalize(`${s}`.toLocaleLowerCase())

export const isFunction = (f: any): f is Function => "function" === typeof f

export function call<T>(f?: () => T): T | undefined
export function call<T, T2>(f?: (arg: T) => T2, arg?: T): T2 | undefined
export function call<T, T2, T3>(f?: (arg: T, arg2: T2) => T3, arg?: T, arg2?: T2): T3 | undefined
export function call(f?: any, arg?: any, arg2?: any): void {
    if (isFunction(f)) return f(arg, arg2)
}

export function callback<T>(f?: () => T): () => T | undefined
export function callback<T, T2>(f?: (arg: T) => T2, arg?: T): () => T2 | undefined
export function callback<T, T2, T3>(f?: (arg: T, arg2: T2) => T3, arg?: T, arg2?: T2): () => T3 | undefined
export function callback(f?: any, arg?: any, arg2?: any) {
    return () => {
        if (isFunction(f)) return f(arg, arg2)
    }
}
