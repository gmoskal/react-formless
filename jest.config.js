module.exports = {
    transform: { ".(ts|tsx)": "ts-jest" },
    testMatch: ["<rootDir>/**/*.spec.(ts|tsx)"],
    moduleFileExtensions: ["js", "ts", "tsx"],
    setupFiles: ["<rootDir>/../../jest.setup.ts"],

    testPathIgnorePatterns: ["<rootDir>[/\\\\](build|node_modules|docs|lib|.next)[/\\\\]"],
    transformIgnorePatterns: ["^.*.+\\.js$", "^.*.+\\.json$"]

    // testEnvironment: "jsdom",
    // testURL: "http://localhost",
    // snapshotSerializers: ["enzyme-to-json/serializer"]
    // watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"]
}
