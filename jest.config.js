module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@engine/(.*)$': '<rootDir>/src/engine/$1'
    },
  };