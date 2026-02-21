module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(test).[jt]s'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js'],
};
