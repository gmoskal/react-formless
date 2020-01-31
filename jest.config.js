module.exports = {
    transform: { ".(ts|tsx)": "ts-jest" },
    testMatch: ["<rootDir>/src/**/*.spec.(ts|tsx)"],
    moduleFileExtensions: ["js", "ts", "tsx", "json"],
    setupFiles: ["<rootDir>/../../jest.setup.ts"],

    testPathIgnorePatterns: ["<rootDir>[/\\\\](build|docs|lib|.next)[/\\\\]"],
    transformIgnorePatterns: ["^.*.+\\.js$"]

    // testEnvironment: "jsdom",
    // testURL: "http://localhost",
    // snapshotSerializers: ["enzyme-to-json/serializer"]
    // watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"]
}
