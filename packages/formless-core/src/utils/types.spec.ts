import { Just, Nothing, equal, Fetched, isFetched, NotFetched, Fetching, FetchError } from "./types"

describe("Common types", () => {
    describe("Maybe<T>", () => {
        it("create Just value", () => expect(Just("foo")).toEqual({ type: "Just", value: "foo" }))
        it("create Nothing value", () => expect(Nothing()).toEqual({ type: "Nothing" }))
        it("recognizes same objects", () => expect(equal(Just("foo"), Just("foo"))).toEqual(true))
        it("recognizes different objects", () => {
            expect(equal(Just("foo"), Just("bar"))).toEqual(false)
            expect(equal(Just("foo"), Nothing())).toEqual(false)
        })
    })
    describe("Async<T>", () => {
        it("Creates Fetched", () => expect(Fetched("foo")).toEqual({ type: "Fetched", value: "foo" }))
        it("Creates NotFetched", () => expect(NotFetched()).toEqual({ type: "NotFetched" }))
        it("Creates Fetching", () => expect(Fetching()).toEqual({ type: "Fetching" }))
        it("Creates FetchingError", () => expect(FetchError("error")).toEqual({ type: "FetchError", value: "error" }))
    })
    describe("isFetched()", () => {
        it("returns false for NotFetched", () => expect(isFetched(NotFetched())).toBe(false))
        it("returns false for Fetching", () => expect(isFetched(Fetching())).toBe(false))
        it("returns false for FetchError", () => expect(isFetched(FetchError("error"))).toBe(true))
        it("returns true for Fetched", () => expect(isFetched(Fetched(null))).toBe(true))
    })
})
