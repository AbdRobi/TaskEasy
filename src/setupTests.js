// Jest Setup File - TaskEasy
// Mock localStorage and DOM elements for testing

// Mock localStorage
const mockLocalStorage = {
  store: {},
  getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorage.store[key]
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {}
  }),
}

Object.defineProperty(global, "localStorage", {
  value: mockLocalStorage,
})

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

// Mock Date.now and Math.random for consistent testing
const mockDateNow = jest.spyOn(Date, "now")
const mockMathRandom = jest.spyOn(Math, "random")

beforeEach(() => {
  // Clear localStorage before each test
  mockLocalStorage.clear()
  mockLocalStorage.getItem.mockClear()
  mockLocalStorage.setItem.mockClear()
  mockLocalStorage.removeItem.mockClear()

  // Reset console mocks
  console.log.mockClear()
  console.error.mockClear()
  console.warn.mockClear()
  console.info.mockClear()

  // Set consistent mock values
  mockDateNow.mockReturnValue(1640995200000) // 2022-01-01T00:00:00.000Z
  mockMathRandom.mockReturnValue(0.123456789)
})

afterEach(() => {
  // Restore mocks after each test
  jest.clearAllMocks()
})

// Global test utilities
global.createMockTask = (overrides = {}) => ({
  id: "mock-id-123",
  title: "Mock Task",
  description: "Mock Description",
  priority: "medium",
  status: "to-do",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

global.expectTaskToBeValid = (task) => {
  expect(task).toHaveProperty("id")
  expect(task).toHaveProperty("title")
  expect(task).toHaveProperty("priority")
  expect(task).toHaveProperty("status")
  expect(task).toHaveProperty("createdAt")
  expect(task).toHaveProperty("updatedAt")
  expect(["high", "medium", "low"]).toContain(task.priority)
  expect(["to-do", "in-progress", "done"]).toContain(task.status)
}

