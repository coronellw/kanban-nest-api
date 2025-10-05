const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
    moduleDirectories: ['node_modules', path.join(__dirname, 'src'), 'src'],
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    rootDir: 'src',
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
      "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    }
};
