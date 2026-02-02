const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: { '^mongoose$': '<rootDir>/__mocks__/mongoose.js' }
}

module.exports = createJestConfig(customJestConfig)
