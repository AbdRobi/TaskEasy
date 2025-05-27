// Jest setup file for TaskEasy - Day 2
require( "@testing-library/jest-dom");

// Mock localStorage
const localStorageMock = {
  data: {},
  getItem: jest.fn(function (key) {
    return this.data[key] || null
  }),
  setItem: jest.fn(function (key, value) {
    this.data[key] = value
  }),
  removeItem: jest.fn(function (key) {
    delete this.data[key]
  }),
  clear: jest.fn(function () {
    this.data = {}
  }),
}

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Mock alert and console
global.alert = jest.fn()
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.data = {}
  jest.clearAllMocks()
})
