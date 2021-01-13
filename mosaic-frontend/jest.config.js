module.exports = {
  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js"
  },
  resolver: "jest-webpack-resolver",
  setupFilesAfterEnv: ['<rootDir>/src/setUpTests.js']
}