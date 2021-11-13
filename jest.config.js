module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.d\\.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/*.spec.ts'
    ],
    setupFiles: [
        '<rootDir>/config/jest/setup/console.setup.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/config/jest/env-setup/check-assertions-number.ts'
    ],
    transform: {
        '^(?!.*\\.(js|ts|tsx|css|json)$)': '<rootDir>/config/jest/transform/file.transform.ts',
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: [
        'web.ts',
        'ts',
        'web.js',
        'js',
        'json',
        'node'
    ],
    globals: {
        'ts-jest': { tsConfig: './tsconfig.spec.json' }
    },
    // We should not set it to 'true' in the config due to the problem with debug:
    // https://intellij-support.jetbrains.com/hc/en-us/community/posts/360004708619-TypeScript-and-Jest-debugger-stops-only-on-breakpoints-in-tests-never-in-source-files
    collectCoverage: false,
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    }
};
