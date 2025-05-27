// Day 2 Tests - US1: Create Task Feature
// TDD Approach: Write tests first, then implement

const { TaskManager } = require("../TaskManager.js");
describe("TaskManager - Day 2: US1 Create Task", () => {
  let taskManager

  beforeEach(() => {
    localStorage.clear()
    taskManager = new TaskManager()
  })

  describe("Initialization", () => {
    test("should initialize with empty tasks array", () => {
      expect(taskManager.tasks).toEqual([])
      expect(taskManager.currentEditId).toBeNull()
    })

    test("should load existing tasks from localStorage", () => {
      const existingTasks = [
        {
          id: "1",
          title: "Test Task",
          description: "Test Description",
          priority: "high",
          status: "to-do",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
      ]
      localStorage.setItem("taskeasy-tasks", JSON.stringify(existingTasks))

      const newTaskManager = new TaskManager()
      expect(newTaskManager.tasks).toEqual(existingTasks)
    })

    test("should handle corrupted localStorage gracefully", () => {
      localStorage.setItem("taskeasy-tasks", "invalid json")

      const newTaskManager = new TaskManager()
      expect(newTaskManager.tasks).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe("US1: Create Task with Title, Description, Priority", () => {
    test("should create a task with all required fields", () => {
      const taskData = {
        title: "Complete Project",
        description: "Finish the TaskEasy application",
        priority: "high",
        status: "to-do",
      }

      const task = taskManager.createTask(taskData)

      expect(task).toMatchObject({
        title: "Complete Project",
        description: "Finish the TaskEasy application",
        priority: "high",
        status: "to-do",
      })
      expect(task.id).toBeDefined()
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
      expect(taskManager.tasks).toHaveLength(1)
    })

    test("should create a task with minimal required fields", () => {
      const taskData = {
        title: "Simple Task",
        priority: "medium",
        status: "to-do",
      }

      const task = taskManager.createTask(taskData)

      expect(task.title).toBe("Simple Task")
      expect(task.priority).toBe("medium")
      expect(task.status).toBe("to-do")
      expect(task.description).toBe("")
    })

    test("should trim whitespace from title and description", () => {
      const taskData = {
        title: "  Task with spaces  ",
        description: "  Description with spaces  ",
        priority: "low",
        status: "to-do",
      }

      const task = taskManager.createTask(taskData)

      expect(task.title).toBe("Task with spaces")
      expect(task.description).toBe("Description with spaces")
    })

    test("should generate unique IDs for each task", () => {
      const task1 = taskManager.createTask({
        title: "Task 1",
        priority: "high",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "Task 2",
        priority: "medium",
        status: "to-do",
      })

      expect(task1.id).not.toBe(task2.id)
      expect(typeof task1.id).toBe("string")
      expect(task1.id.length).toBeGreaterThan(0)
    })

    test("should set creation and update timestamps", () => {
      const beforeCreate = new Date().toISOString()

      const task = taskManager.createTask({
        title: "Timestamped Task",
        priority: "medium",
        status: "to-do",
      })

      const afterCreate = new Date().toISOString()

      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
      expect(task.createdAt).toBe(task.updatedAt)
      expect(task.createdAt >= beforeCreate).toBe(true)
      expect(task.createdAt <= afterCreate).toBe(true)
    })

    test("should save task to localStorage", () => {
      const taskData = {
        title: "Persistent Task",
        description: "This should be saved",
        priority: "high",
        status: "to-do",
      }

      taskManager.createTask(taskData)

      expect(localStorage.setItem).toHaveBeenCalledWith("taskeasy-tasks", expect.stringContaining("Persistent Task"))
    })
  })

  describe("Task Validation", () => {
    test("should require title", () => {
      const invalidTask = {
        title: "",
        priority: "medium",
        status: "to-do",
      }

      expect(() => taskManager.createTask(invalidTask)).toThrow("Title is required")
    })

    test("should require title to be non-whitespace", () => {
      const invalidTask = {
        title: "   ",
        priority: "medium",
        status: "to-do",
      }

      expect(() => taskManager.createTask(invalidTask)).toThrow("Title is required")
    })

    test("should validate priority values", () => {
      const invalidTask = {
        title: "Valid Title",
        priority: "invalid-priority",
        status: "to-do",
      }

      expect(() => taskManager.createTask(invalidTask)).toThrow("Invalid priority")
    })

    test("should validate status values", () => {
      const invalidTask = {
        title: "Valid Title",
        priority: "medium",
        status: "invalid-status",
      }

      expect(() => taskManager.createTask(invalidTask)).toThrow("Invalid status")
    })

    test("should limit title length", () => {
      const invalidTask = {
        title: "a".repeat(101),
        priority: "medium",
        status: "to-do",
      }

      expect(() => taskManager.createTask(invalidTask)).toThrow("Title too long")
    })

    test("should accept valid priority values", () => {
      const priorities = ["high", "medium", "low"]

      priorities.forEach((priority) => {
        expect(() => {
          taskManager.createTask({
            title: `Task with ${priority} priority`,
            priority: priority,
            status: "to-do",
          })
        }).not.toThrow()
      })
    })

    test("should accept valid status values", () => {
      const statuses = ["to-do", "in-progress", "done"]

      statuses.forEach((status) => {
        expect(() => {
          taskManager.createTask({
            title: `Task with ${status} status`,
            priority: "medium",
            status: status,
          })
        }).not.toThrow()
      })
    })
  })

  describe("Utility Functions", () => {
    test("should generate unique IDs", () => {
      const id1 = taskManager.generateId()
      const id2 = taskManager.generateId()

      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe("string")
      expect(id1.length).toBeGreaterThan(0)
    })

    test("should escape HTML in task content", () => {
      const maliciousInput = '<script>alert("xss")</script>'
      const escaped = taskManager.escapeHtml(maliciousInput)

      expect(escaped).not.toContain("<script>")
      expect(escaped).toContain("&lt;")
      expect(escaped).toContain("&gt;")
    })
  })

  describe("Data Persistence", () => {
    test("should persist tasks across instances", () => {
      // Create task in first instance
      taskManager.createTask({
        title: "Persistent Task",
        description: "Should survive restart",
        priority: "high",
        status: "to-do",
      })

      // Create new instance (simulating app restart)
      const newTaskManager = new TaskManager()

      expect(newTaskManager.tasks).toHaveLength(1)
      expect(newTaskManager.tasks[0].title).toBe("Persistent Task")
    })

    test("should handle localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      localStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded")
      })

      expect(() => {
        taskManager.createTask({
          title: "Test Task",
          priority: "medium",
          status: "to-do",
        })
      }).not.toThrow()

      expect(console.error).toHaveBeenCalled()
    })
  })
})
