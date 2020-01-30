// type NoInfer<T> = [T][T extends any ? 0 : never]
// type XAsync<T> = { type: "not-started" | "pending" } | { type: "done"; value: T } | { type: "error" }
// type Store<T> = {
//     history: XAsync<T>[]
//     current: NoInfer<T>
// }

// type Store2<T> = {
//     current: T
//     history: XAsync<T>[]
// }

// type User = { name: string }

// const getStore
// const users: Store<XAsync<User[]>> = {
//     history: [],
//     current: { type: "not-started" }
// }

// const users2: Store2 = {
//     history: [],
//     current: { type: "not-started-fo" }
// }
