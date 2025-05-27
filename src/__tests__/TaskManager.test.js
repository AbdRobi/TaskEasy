const TaskManager = require("../TaskManager")

// Mock Date.now and Math.random for consistent testing
const mockDateNow = jest.spyOn(Date, "now")
const mockMathRandom = jest.spyOn(Math, "random")

describe("TaskManager - Day 2: US1 Create Task", () => {
  let taskManager

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    localStorage.getItem.mockClear()
    localStorage.setItem.mockClear()
    console.log.mockClear()
    console.error.mockClear()

    mockDateNow.mockReturnValue(1640995200000)
    mockMathRandom.mockReturnValue(0.123456789)

    taskManager = new TaskManager()
  })

  describe("US1: Create Task Tests (12 test cases)", () => {
    it("should create a task with valid data", () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        priority: "high",
        status: "to-do",
      }

      const task = taskManager.createTask(taskData)

      expect(task).toHaveProperty("id")
      expect(task.title).toBe("Test Task")
      expect(task.description).toBe("Test Description")
      expect(task.priority).toBe("high")
      expect(task.status).toBe("to-do")
      expect(task).toHaveProperty("createdAt")
      expect(task).toHaveProperty("updatedAt")
    })

    it("should create task with minimal required data", () => {
      const taskData = {
        title: "Minimal Task",
        priority: "medium",
        status: "to-do",
      }

      const task = taskManager.createTask(taskData)

      expect(task.title).toBe("Minimal Task")
      expect(task.description).toBe("")
      expect(task.priority).toBe("medium")
      expect(task.status).toBe("to-do")
    })

    it("should trim whitespace from title and description", () => {
      const taskData = {
        title: "  Trimmed Task  ",
        description: "  Trimmed Description  ",
        priority: "low",
        status: "in-progress",
      }

      const task = taskManager.createTask(taskData)

      expect(task.title).toBe("Trimmed Task")
      expect(task.description).toBe("Trimmed Description")
    })

    it("should add task to tasks array", () => {
      const initialLength = taskManager.tasks.length

      taskManager.createTask({
        title: "Array Test",
        priority: "medium",
        status: "to-do",
      })

      expect(taskManager.tasks.length).toBe(initialLength + 1)
      expect(taskManager.tasks[taskManager.tasks.length - 1].title).toBe("Array Test")
    })

    it("should save tasks to localStorage after creation", () => {
      taskManager.createTask({
        title: "Storage Test",
        priority: "high",
        status: "done",
      })

      expect(localStorage.setItem).toHaveBeenCalledWith("taskeasy-tasks", expect.any(String))
    })

    it("should generate unique IDs for different tasks", () => {
      const task1 = taskManager.createTask({
        title: "Task 1",
        priority: "high",
        status: "to-do",
      })

      // Change mock values to simulate different time/random
      mockDateNow.mockReturnValue(1640995300000)
      mockMathRandom.mockReturnValue(0.987654321)

      const task2 = taskManager.createTask({
        title: "Task 2",
        priority: "low",
        status: "done",
      })

      expect(task1.id).not.toBe(task2.id)
    })

    it("should handle all priority levels", () => {
      const priorities = ["high", "medium", "low"]

      priorities.forEach((priority) => {
        const task = taskManager.createTask({
          title: `${priority} priority task`,
          priority,
          status: "to-do",
        })

        expect(task.priority).toBe(priority)
      })
    })

    it("should handle all status levels", () => {
      const statuses = ["to-do", "in-progress", "done"]

      statuses.forEach((status) => {
        const task = taskManager.createTask({
          title: `${status} status task`,
          priority: "medium",
          status,
        })

        expect(task.status).toBe(status)
      })
    })

    it("should set createdAt and updatedAt timestamps", () => {
      const task = taskManager.createTask({
        title: "Timestamp Test",
        priority: "medium",
        status: "to-do",
      })

      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
      expect(new Date(task.createdAt)).toBeInstanceOf(Date)
      expect(new Date(task.updatedAt)).toBeInstanceOf(Date)
    })

    it("should handle empty description gracefully", () => {
      const task = taskManager.createTask({
        title: "No Description Task",
        description: "",
        priority: "medium",
        status: "to-do",
      })

      expect(task.description).toBe("")
    })

    it("should handle undefined description", () => {
      const task = taskManager.createTask({
        title: "Undefined Description Task",
        priority: "medium",
        status: "to-do",
      })

      expect(task.description).toBe("")
    })

    it("should create multiple tasks successfully", () => {
      const tasksToCreate = [
        { title: "Task 1", priority: "high", status: "to-do" },
        { title: "Task 2", priority: "medium", status: "in-progress" },
        { title: "Task 3", priority: "low", status: "done" },
      ]

      tasksToCreate.forEach((taskData) => {
        taskManager.createTask(taskData)
      })

      expect(taskManager.tasks.length).toBe(3)
      expect(taskManager.tasks.map((t) => t.title)).toEqual(["Task 1", "Task 2", "Task 3"])
    })
  })

  describe("Validation Tests (8 test cases)", () => {
    it("should throw error for empty title", () => {
      expect(() => {
        taskManager.createTask({
          title: "",
          priority: "medium",
          status: "to-do",
        })
      }).toThrow("Title is required")
    })

    it("should throw error for whitespace-only title", () => {
      expect(() => {
        taskManager.createTask({
          title: "   ",
          priority: "medium",
          status: "to-do",
        })
      }).toThrow("Title is required")
    })

    it("should throw error for missing title", () => {
      expect(() => {
        taskManager.createTask({
          priority: "medium",
          status: "to-do",
        })
      }).toThrow("Title is required")
    })

    it("should throw error for title exceeding 100 characters", () => {
      const longTitle = "a".repeat(101)

      expect(() => {
        taskManager.createTask({
          title: longTitle,
          priority: "medium",
          status: "to-do",
        })
      }).toThrow("Title must be less than 100 characters")
    })

    it("should accept title with exactly 100 characters", () => {
      const maxTitle = "a".repeat(100)

      const task = taskManager.createTask({
        title: maxTitle,
        priority: "medium",
        status: "to-do",
      })

      expect(task.title).toBe(maxTitle)
    })

    it("should throw error for invalid priority", () => {
      expect(() => {
        taskManager.createTask({
          title: "Test Task",
          priority: "invalid",
          status: "to-do",
        })
      }).toThrow("Invalid priority value")
    })

    it("should throw error for invalid status", () => {
      expect(() => {
        taskManager.createTask({
          title: "Test Task",
          priority: "medium",
          status: "invalid",
        })
      }).toThrow("Invalid status value")
    })

    it("should return first validation error when multiple errors exist", () => {
      expect(() => {
        taskManager.createTask({
          title: "",
          priority: "invalid",
          status: "invalid",
        })
      }).toThrow("Title is required")
    })
  })

  describe("Persistence Tests (4 test cases)", () => {
    it("should load empty array when localStorage is empty", () => {
      const newTaskManager = new TaskManager()

      expect(newTaskManager.tasks).toEqual([])
    })

    it("should load existing tasks from localStorage", () => {
      const existingTasks = [
        {
          id: "test-id-1",
          title: "Existing Task",
          description: "From storage",
          priority: "high",
          status: "to-do",
          createdAt: "2022-01-01T00:00:00.000Z",
          updatedAt: "2022-01-01T00:00:00.000Z",
        },
      ]

      localStorage.getItem.mockReturnValue(JSON.stringify(existingTasks))

      const newTaskManager = new TaskManager()

      expect(newTaskManager.tasks).toEqual(existingTasks)
    })

    it("should handle corrupted localStorage data gracefully", () => {
      localStorage.getItem.mockReturnValue("invalid json")

      const newTaskManager = new TaskManager()

      expect(newTaskManager.tasks).toEqual([])
      expect(console.error).toHaveBeenCalledWith("Error loading tasks:", expect.any(Error))
    })

    it("should handle localStorage save errors gracefully", () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded")
      })

      taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(console.error).toHaveBeenCalledWith("Error saving tasks:", expect.any(Error))
    })
  })

  describe("Utility Functions Tests (3 test cases)", () => {
    it("should format dates as relative time strings", () => {
      const now = new Date()

      const justNow = now.toISOString()
      expect(taskManager.formatDate(justNow)).toBe("Just now")

      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
      expect(taskManager.formatDate(fiveMinutesAgo)).toBe("5m ago")

      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      expect(taskManager.formatDate(twoHoursAgo)).toBe("2h ago")

      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      expect(taskManager.formatDate(threeDaysAgo)).toBe("3d ago")
    })

    it("should generate unique identifiers", () => {
      const id1 = taskManager.generateId()

      mockDateNow.mockReturnValue(1640995400000)
      mockMathRandom.mockReturnValue(0.555555555)

      const id2 = taskManager.generateId()

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe("string")
      expect(typeof id2).toBe("string")
    })
  })

  describe("Browser Environment Tests", () => {
    test("should handle undefined localStorage", () => {
      const originalLocalStorage = global.localStorage
      delete global.localStorage

      const newTaskManager = new TaskManager()
      expect(newTaskManager.tasks).toEqual([])

      global.localStorage = originalLocalStorage
    })

    test("should handle undefined window", () => {
      const originalWindow = global.window
      delete global.window

      expect(() => {
        new TaskManager()
      }).not.toThrow()

      global.window = originalWindow
    })

    test("should handle undefined document", () => {
      const originalDocument = global.document
      delete global.document

      expect(() => {
        new TaskManager()
      }).not.toThrow()

      global.document = originalDocument
    })
  })

  describe("Additional Validation Edge Cases", () => {
    test("should handle null title", () => {
      expect(() => {
        taskManager.createTask({
          title: null,
          priority: "medium",
          status: "to-do",
        })
      }).toThrow("Title is required")
    })

    test("should handle undefined priority", () => {
      expect(() => {
        taskManager.createTask({
          title: "Test Task",
          priority: undefined,
          status: "to-do",
        })
      }).toThrow("Invalid priority value")
    })

    test("should handle undefined status", () => {
      expect(() => {
        taskManager.createTask({
          title: "Test Task",
          priority: "medium",
          status: undefined,
        })
      }).toThrow("Invalid status value")
    })

    test("should handle empty object", () => {
      expect(() => {
        taskManager.createTask({})
      }).toThrow("Title is required")
    })

    test("should handle numeric title", () => {
      const task = taskManager.createTask({
        title: 123,
        priority: "medium",
        status: "to-do",
      })

      expect(task.title).toBe("123")
    })

    test("should handle numeric description", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: 456,
        priority: "medium",
        status: "to-do",
      })

      expect(task.description).toBe("456")
    })
  })

  describe("Module Export Tests", () => {
    test("should export TaskManager for CommonJS", () => {
      expect(typeof TaskManager).toBe("function")
    })

    test("should create multiple instances", () => {
      const tm1 = new TaskManager()
      const tm2 = new TaskManager()

      tm1.createTask({
        title: "Task 1",
        priority: "high",
        status: "to-do",
      })

      expect(tm1.tasks).toHaveLength(1)
      expect(tm2.tasks).toHaveLength(0)
    })
  })

  describe("Additional Coverage for Day 2", () => {
    test("should handle initializeEventListeners without DOM", () => {
      expect(() => {
        taskManager.initializeEventListeners()
      }).not.toThrow()
    })

    test("should handle handleFormSubmit without DOM elements", () => {
      expect(() => {
        taskManager.handleFormSubmit()
      }).not.toThrow()
    })

    test("should handle handleFormSubmit in edit mode", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)

      expect(() => {
        taskManager.handleFormSubmit()
      }).not.toThrow()
    })

    test("should handle showNotification without document", () => {
      expect(() => {
        taskManager.showNotification("Test message")
      }).not.toThrow()
    })

    test("should handle renderTasks without taskList element", () => {
      expect(() => {
        taskManager.renderTasks()
      }).not.toThrow()
    })

    test("should handle updateStats without statsEl element", () => {
      expect(() => {
        taskManager.updateStats()
      }).not.toThrow()
    })

    test("should handle constructor with DOM elements", () => {
      const mockElements = {
        taskForm: { addEventListener: jest.fn() },
        cancelBtn: { addEventListener: jest.fn() },
      }

      global.document = {
        getElementById: jest.fn((id) => mockElements[id] || null),
      }
      global.window = {}

      const newTaskManager = new TaskManager()
      expect(newTaskManager).toBeDefined()

      delete global.document
      delete global.window
    })

    test("should handle all priority and status combinations", () => {
      const priorities = ["high", "medium", "low"]
      const statuses = ["to-do", "in-progress", "done"]

      priorities.forEach((priority) => {
        statuses.forEach((status) => {
          const task = taskManager.createTask({
            title: `Task ${priority} ${status}`,
            priority,
            status,
          })

          expect(task.priority).toBe(priority)
          expect(task.status).toBe(status)
        })
      })

      expect(taskManager.tasks).toHaveLength(9)
    })

    test("should handle valid string conversion edge cases", () => {
      const validCases = [
        { input: 0, expected: "0" },
        { input: false, expected: "false" },
        { input: true, expected: "true" },
        { input: 123, expected: "123" },
        { input: {}, expected: "[object Object]" },
      ]

      validCases.forEach(({ input, expected }) => {
        const task = taskManager.createTask({
          title: input,
          priority: "medium",
          status: "to-do",
        })

        expect(task.title).toBe(expected)
      })
    })

    test("should handle invalid string conversion edge cases", () => {
      const invalidCases = [
        { input: [], description: "empty array becomes empty string" },
        { input: "", description: "empty string" },
        { input: "   ", description: "whitespace only" },
        { input: null, description: "null value" },
        { input: undefined, description: "undefined value" },
      ]

      invalidCases.forEach(({ input, description }) => {
        expect(() => {
          taskManager.createTask({
            title: input,
            priority: "medium",
            status: "to-do",
          })
        }).toThrow("Title is required")
      })
    })

    test("should initialize DOM methods in constructor with full environment", () => {
      // Mock complete DOM environment
      const mockForm = { addEventListener: jest.fn() }
      const mockCancelBtn = { addEventListener: jest.fn() }
      const mockTaskList = { innerHTML: "" }
      const mockStatsEl = { textContent: "" }

      global.document = {
        getElementById: jest.fn((id) => {
          const elements = {
            taskForm: mockForm,
            cancelBtn: mockCancelBtn,
            taskList: mockTaskList,
            taskStats: mockStatsEl,
          }
          return elements[id] || null
        }),
      }
      global.window = {}

      // Create new TaskManager - this will trigger lines 11-13
      const newTaskManager = new TaskManager()

      // Verify DOM initialization happened
      expect(mockForm.addEventListener).toHaveBeenCalled()
      expect(mockTaskList.innerHTML).toBeDefined()
      expect(mockStatsEl.textContent).toBeDefined()

      // Cleanup
      delete global.document
      delete global.window
    })

    test("should handle constructor DOM initialization edge cases", () => {
      // Test with document but no window
      global.document = { getElementById: jest.fn(() => null) }
      delete global.window

      expect(() => {
        new TaskManager()
      }).not.toThrow()

      // Test with window but no document
      delete global.document
      global.window = {}

      expect(() => {
        new TaskManager()
      }).not.toThrow()

      // Cleanup
      delete global.window
    })

    test("should execute DOM methods when both document and window exist", () => {
      // Create spies before mocking environment
      const originalTaskManager = new TaskManager()
      const initSpy = jest.spyOn(TaskManager.prototype, "initializeEventListeners").mockImplementation(() => {})
      const renderSpy = jest.spyOn(TaskManager.prototype, "renderTasks").mockImplementation(() => {})
      const statsSpy = jest.spyOn(TaskManager.prototype, "updateStats").mockImplementation(() => {})

      // Mock environment
      global.document = { getElementById: jest.fn() }
      global.window = {}

      // Create new instance - should call the three methods
      new TaskManager()

      // Verify methods were called
      expect(initSpy).toHaveBeenCalled()
      expect(renderSpy).toHaveBeenCalled()
      expect(statsSpy).toHaveBeenCalled()

      // Cleanup
      initSpy.mockRestore()
      renderSpy.mockRestore()
      statsSpy.mockRestore()
      delete global.document
      delete global.window
    })
  })
})

