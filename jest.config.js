module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./tests/setup/setupBeforeEnv.js'],
  setupFilesAfterEnv: ['./tests/setup/setupAfterEnv.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'config',
    '<rootDir>/src/index.js',
  ],
}
