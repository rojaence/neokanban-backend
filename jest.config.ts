import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@environment/(.*)$': '<rootDir>/src/environment/$1',
    '^@test/(.*)$': '<rootDir>/src/test/$1',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
