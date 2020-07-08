import {
    mkJust,
    mkNothing,
    equal,
    mkFetched,
    isFetched,
    mkNotFetched,
    mkFetching,
    mkFetchError,
    isFetching,
    isNotFetched,
    isFetchError
} from "./types"

describe("Common types", () => {
    describe("Maybe<T>", () => {
        it("create Just value", () => expect(mkJust("foo")).toEqual({ type: "Just", value: "foo" }))
        it("create Nothing value", () => expect(mkNothing()).toEqual({ type: "Nothing" }))
        it("recognizes same objects", () => expect(equal(mkJust("foo"), mkJust("foo"))).toEqual(true))
        it("recognizes different objects", () => {
            expect(equal(mkJust("foo"), mkJust("bar"))).toEqual(false)
            expect(equal(mkJust("foo"), mkNothing())).toEqual(false)
        })
    })
    describe("Async<T>", () => {
        it("Creates Fetched", () => expect(mkFetched("foo")).toEqual({ type: "Fetched", value: "foo" }))
        it("Creates NotFetched", () => expect(mkNotFetched()).toEqual({ type: "NotFetched" }))
        it("Creates Fetching", () => expect(mkFetching()).toEqual({ type: "Fetching" }))
        it("Creates FetchingError", () => expect(mkFetchError("error")).toEqual({ type: "FetchError", value: "error" }))
    })
    describe("isFetched()", () => {
        it("returns false for NotFetched", () => expect(isFetched(mkNotFetched())).toBe(false))
        it("returns false for Fetching", () => expect(isFetched(mkFetching())).toBe(false))
        it("returns false for FetchError", () => expect(isFetched(mkFetchError("error"))).toBe(false))
        it("returns true for Fetched", () => expect(isFetched(mkFetched(null))).toBe(true))
    })
    describe("isFetching()", () => {
        it("returns false for NotFetched", () => expect(isFetching(mkNotFetched())).toBe(false))
        it("returns true for Fetching", () => expect(isFetching(mkFetching())).toBe(true))
        it("returns false for FetchError", () => expect(isFetching(mkFetchError("error"))).toBe(false))
        it("returns false for Fetched", () => expect(isFetching(mkFetched(null))).toBe(false))
    })
    describe("isNotFetched()", () => {
        it("returns true for undefined", () => expect(isNotFetched(undefined)).toBe(true))
        it("returns true for NotFetched", () => expect(isNotFetched(mkNotFetched())).toBe(true))
        it("returns false for Fetching", () => expect(isNotFetched(mkFetching())).toBe(false))
        it("returns false for FetchError", () => expect(isNotFetched(mkFetchError("error"))).toBe(false))
        it("returns false for Fetched", () => expect(isNotFetched(mkFetched(null))).toBe(false))
    })
    describe("isFetchError()", () => {
        it("returns false for NotFetched", () => expect(isFetchError(mkNotFetched())).toBe(false))
        it("returns false for Fetching", () => expect(isFetchError(mkFetching())).toBe(false))
        it("returns true for FetchError", () => expect(isFetchError(mkFetchError("error"))).toBe(true))
        it("returns false for Fetched", () => expect(isFetchError(mkFetched(null))).toBe(false))
    })
})
