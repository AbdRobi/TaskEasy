// TaskEasy Tests - Following TDD Approach
// Simple testing framework for demonstration

class TestRunner {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
  }

  test(description, testFunction) {
    this.tests.push({ description, testFunction })
  }

  run() {
    console.log("🧪 Running TaskEasy Tests...\n")

    this.tests.forEach((test, index) => {
      try {
        test.testFunction()
        this.passed++
        console.log(`✅ Test ${index + 1}: ${test.description}`)
      } catch (error) {
        this.failed++
        console.log(`❌ Test ${index + 1}: ${test.description}`)
        console.log(`   Error: ${error.message}`)
      }
    })

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`)
    return this.failed === 0
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed")
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`)
    }
  }
}

// Test Suite
const testRunner = new TestRunner()

// Mock localStorage for testing
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  clear() {
    this.data = {}
  },
}

// Mock TaskManager class for testing
class TaskManager {
  constructor() {
    this.tasks = []
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15)
  }

  createTask(taskData) {
    const task = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
    }
    this.tasks.push(task)
  }

  sortTasksByPriority(tasks) {
    const priorityOrder = { high: 1, medium: 2, low: 3 }
    return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates }
    }
  }

  getFilteredTasks() {
    const filterStatus = global.document.getElementById("filterStatus").value
    const filterPriority = global.document.getElementById("filterPriority").value

    let filteredTasks = this.tasks

    if (filterStatus !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus)
    }

    if (filterPriority !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.priority === filterPriority)
    }

    return filteredTasks
  }

  escapeHtml(str) {
    const div = document.createElement("div")
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }
}

// Test TaskManager class
testRunner.test("TaskManager should initialize with empty tasks", () => {
  // Setup
  global.localStorage = mockLocalStorage
  mockLocalStorage.clear()

  // Test
  const taskManager = new TaskManager()
  testRunner.assertEqual(taskManager.tasks.length, 0, "Should start with no tasks")
})

testRunner.test("Should generate unique IDs", () => {
  const taskManager = new TaskManager()
  const id1 = taskManager.generateId()
  const id2 = taskManager.generateId()

  testRunner.assert(id1 !== id2, "Generated IDs should be unique")
  testRunner.assert(typeof id1 === "string", "ID should be a string")
})

testRunner.test("Should create task with correct properties", () => {
  global.localStorage = mockLocalStorage
  mockLocalStorage.clear()

  const taskManager = new TaskManager()
  const taskData = {
    title: "Test Task",
    description: "Test Description",
    priority: "high",
    status: "to-do",
  }

  taskManager.createTask(taskData)

  testRunner.assertEqual(taskManager.tasks.length, 1, "Should have one task")
  testRunner.assertEqual(taskManager.tasks[0].title, "Test Task", "Title should match")
  testRunner.assertEqual(taskManager.tasks[0].priority, "high", "Priority should match")
  testRunner.assert(taskManager.tasks[0].id, "Task should have an ID")
})

testRunner.test("Should sort tasks by priority correctly", () => {
  const taskManager = new TaskManager()
  const tasks = [
    { priority: "low", createdAt: "2023-01-01" },
    { priority: "high", createdAt: "2023-01-02" },
    { priority: "medium", createdAt: "2023-01-03" },
  ]

  const sorted = taskManager.sortTasksByPriority(tasks)

  testRunner.assertEqual(sorted[0].priority, "high", "High priority should be first")
  testRunner.assertEqual(sorted[1].priority, "medium", "Medium priority should be second")
  testRunner.assertEqual(sorted[2].priority, "low", "Low priority should be last")
})

testRunner.test("Should update task correctly", () => {
  global.localStorage = mockLocalStorage
  mockLocalStorage.clear()

  const taskManager = new TaskManager()

  // Create initial task
  taskManager.createTask({
    title: "Original Title",
    description: "Original Description",
    priority: "low",
    status: "to-do",
  })

  const taskId = taskManager.tasks[0].id

  // Update task
  taskManager.updateTask(taskId, {
    title: "Updated Title",
    priority: "high",
  })

  testRunner.assertEqual(taskManager.tasks[0].title, "Updated Title", "Title should be updated")
  testRunner.assertEqual(taskManager.tasks[0].priority, "high", "Priority should be updated")
  testRunner.assertEqual(
    taskManager.tasks[0].description,
    "Original Description",
    "Description should remain unchanged",
  )
})

testRunner.test("Should delete task correctly", () => {
  global.localStorage = mockLocalStorage
  mockLocalStorage.clear()

  const taskManager = new TaskManager()

  // Create tasks
  taskManager.createTask({ title: "Task 1", priority: "low", status: "to-do" })
  taskManager.createTask({ title: "Task 2", priority: "high", status: "done" })

  const taskIdToDelete = taskManager.tasks[0].id

  // Delete task
  taskManager.tasks = taskManager.tasks.filter((task) => task.id !== taskIdToDelete)

  testRunner.assertEqual(taskManager.tasks.length, 1, "Should have one task remaining")
  testRunner.assertEqual(taskManager.tasks[0].title, "Task 2", "Remaining task should be Task 2")
})

testRunner.test("Should filter tasks by status", () => {
  const taskManager = new TaskManager()
  taskManager.tasks = [
    { status: "to-do", priority: "high" },
    { status: "in-progress", priority: "medium" },
    { status: "done", priority: "low" },
    { status: "to-do", priority: "low" },
  ]

  // Mock DOM elements
  global.document = {
    getElementById: (id) => {
      if (id === "filterStatus") return { value: "to-do" }
      if (id === "filterPriority") return { value: "all" }
    },
  }

  const filtered = taskManager.getFilteredTasks()

  testRunner.assertEqual(filtered.length, 2, "Should return 2 to-do tasks")
  testRunner.assert(
    filtered.every((task) => task.status === "to-do"),
    "All filtered tasks should have to-do status",
  )
})

testRunner.test("Should escape HTML in task content", () => {
  const taskManager = new TaskManager()
  const maliciousInput = '<script>alert("xss")</script>'
  const escaped = taskManager.escapeHtml(maliciousInput)

  testRunner.assert(!escaped.includes("<script>"), "Should escape script tags")
  testRunner.assert(escaped.includes("&lt;"), "Should contain escaped characters")
})

testRunner.test("Should format date correctly", () => {
  const taskManager = new TaskManager()
  const testDate = "2023-12-25T10:30:00.000Z"
  const formatted = taskManager.formatDate(testDate)

  testRunner.assert(typeof formatted === "string", "Should return a string")
  testRunner.assert(formatted.length > 0, "Should not be empty")
})

// Run tests if in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TestRunner, testRunner }
} else {
  // Run tests in browser console
  console.log("TaskEasy Test Suite")
  console.log("Run testRunner.run() in the console to execute tests")
}
