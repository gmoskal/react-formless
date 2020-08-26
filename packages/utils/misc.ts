import { isFunction } from "./validators"

export const _noop = (): any => undefined
export const _anything: any = {}
export const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1)
export const labelize = (s: string) => capitalize(`${s}`.toLocaleLowerCase())

export function call<T>(f?: () => T): T | undefined
export function call<T, T2>(f?: (arg: T) => T2, arg?: T): T2 | undefined
export function call<T, T2, T3>(f?: (arg: T, arg2: T2) => T3, arg?: T, arg2?: T2): T3 | undefined
export function call(f?: any, arg?: any, arg2?: any): void {
    return isFunction(f) ? f(arg, arg2) : null
}

export function callback<T>(f?: () => T): () => T | undefined
export function callback<T, T2>(f?: (arg: T) => T2, arg?: T): () => T2 | undefined
export function callback<T, T2, T3>(f?: (arg: T, arg2: T2) => T3, arg?: T, arg2?: T2): () => T3 | undefined
export function callback(f?: any, arg?: any, arg2?: any) {
    return () => call(f, arg, arg2)
}
