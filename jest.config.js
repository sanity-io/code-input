/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const crypto = require('crypto')
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.yalc', 'node_modules', '.idea', 'lib', '.parcel-cache'],
  globals: {
    crypto: {
      getRandomValues: (arr) => crypto.randomBytes(arr.length),
    },
  },
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', {babelConfig: true}],
    '^.+\\.(mjs|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(nanoid|uuid|get-random-values-esm))'],
}
