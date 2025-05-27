// Setup file for Jest tests

// Mock localStorage with proper Jest mock functions
const localStorageMock = (() => {
  let store = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    })
  };
})();

// Assign to global
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Also assign to global for Node.js environment
global.localStorage = localStorageMock;

// Mock console methods to avoid noise in tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock Date.now for consistent ID generation
const mockDateNow = 1640995200000; // 2022-01-01 00:00:00
const originalDateNow = Date.now;
Date.now = jest.fn(() => mockDateNow);

// Mock Math.random for consistent ID generation
const originalMathRandom = Math.random;
Math.random = jest.fn(() => 0.123456789);

// Setup DOM elements that TaskManager expects
beforeEach(() => {
  // Clear the store
  localStorageMock.clear();
  
  // Reset all mocks
  jest.clearAllMocks();
  
  // Setup DOM
  document.body.innerHTML = `
    <div id="taskStats">0 tasks</div>
    <form id="taskForm">
      <input type="text" id="taskTitle" />
      <textarea id="taskDescription"></textarea>
      <select id="taskPriority">
        <option value="high">High</option>
        <option value="medium" selected>Medium</option>
        <option value="low">Low</option>
      </select>
      <select id="taskStatus">
        <option value="to-do" selected>To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit" class="add-btn">Create Task</button>
    </form>
    <div id="taskList"></div>
  `;
  
  // Reset Date and Math mocks to default values
  Date.now.mockReturnValue(mockDateNow);
  Math.random.mockReturnValue(0.123456789);
});

afterEach(() => {
  // Clean up any notifications that might have been added
  const notifications = document.querySelectorAll('.notification');
  notifications.forEach(notification => {
    if (notification.parentNode) {
      notification.remove();
    }
  });
  
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  // Restore original functions
  Date.now = originalDateNow;
  Math.random = originalMathRandom;
  global.console = originalConsole;
});
