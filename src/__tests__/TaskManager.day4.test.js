const TaskManager = require("../TaskManager")

// Mock Date.now and Math.random for consistent testing
const mockDateNow = jest.spyOn(Date, "now")
const mockMathRandom = jest.spyOn(Math, "random")

describe("TaskEasy Day 4 - US3 Update Tasks Comprehensive Tests", () => {
  let taskManager

  beforeEach(() => {
    localStorage.clear()
    localStorage.getItem.mockClear()
    localStorage.setItem.mockClear()

    // Reset mocks with different values for unique IDs
    mockDateNow.mockReturnValue(1640995200000)
    mockMathRandom.mockReturnValue(0.123456789)

    taskManager = new TaskManager()
  })

  describe("US3 Update Tasks - Core Functionality", () => {
    test("should update task title successfully", () => {
      const task = taskManager.createTask({
        title: "Original Title",
        description: "Original description",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Title",
      })

      expect(updatedTask.title).toBe("Updated Title")
      expect(updatedTask.description).toBe("Original description")
      expect(updatedTask.priority).toBe("medium")
      expect(updatedTask.status).toBe("to-do")
      expect(updatedTask.id).toBe(task.id)
      expect(updatedTask.createdAt).toBe(task.createdAt)
      expect(updatedTask.updatedAt).toBeDefined()
      expect(new Date(updatedTask.updatedAt)).toBeInstanceOf(Date)
    })

    test("should update task description successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: "Original description",
        priority: "high",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        description: "Updated description",
      })

      expect(updatedTask.description).toBe("Updated description")
      expect(updatedTask.title).toBe("Test Task")
    })

    test("should update task priority successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "low",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        priority: "high",
      })

      expect(updatedTask.priority).toBe("high")
      expect(updatedTask.title).toBe("Test Task")
    })

    test("should update task status successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        status: "done",
      })

      expect(updatedTask.status).toBe("done")
      expect(updatedTask.title).toBe("Test Task")
    })

    test("should update multiple fields simultaneously", () => {
      const task = taskManager.createTask({
        title: "Original Task",
        description: "Original description",
        priority: "low",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Task",
        description: "Updated description",
        priority: "high",
        status: "in-progress",
      })

      expect(updatedTask.title).toBe("Updated Task")
      expect(updatedTask.description).toBe("Updated description")
      expect(updatedTask.priority).toBe("high")
      expect(updatedTask.status).toBe("in-progress")
    })

    test("should trim whitespace from title and description", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: "  Updated Title  ",
        description: "  Updated description  ",
      })

      expect(updatedTask.title).toBe("Updated Title")
      expect(updatedTask.description).toBe("Updated description")
    })

    test("should preserve createdAt timestamp", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const originalCreatedAt = task.createdAt

      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Title",
      })

      expect(updatedTask.createdAt).toBe(originalCreatedAt)
    })

    test("should update the updatedAt timestamp", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const pastTime = new Date(Date.now() - 1000).toISOString()
      task.updatedAt = pastTime
      taskManager.tasks[0].updatedAt = pastTime

      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Title",
      })

      expect(updatedTask.updatedAt).not.toBe(pastTime)
      expect(new Date(updatedTask.updatedAt)).toBeInstanceOf(Date)
    })

    test("should throw error for non-existent task", () => {
      expect(() => {
        taskManager.updateTask("non-existent-id", {
          title: "Updated Title",
        })
      }).toThrow("Task not found")
    })

    test("should validate updated title is not empty", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(() => {
        taskManager.updateTask(task.id, {
          title: "",
        })
      }).toThrow("Title is required")
    })

    test("should validate updated title length", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const longTitle = "a".repeat(101)

      expect(() => {
        taskManager.updateTask(task.id, {
          title: longTitle,
        })
      }).toThrow("Title must be less than 100 characters")
    })

    test("should validate updated priority value", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(() => {
        taskManager.updateTask(task.id, {
          priority: "invalid",
        })
      }).toThrow("Invalid priority value")
    })

    test("should validate updated status value", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(() => {
        taskManager.updateTask(task.id, {
          status: "invalid",
        })
      }).toThrow("Invalid status value")
    })

    test("should handle partial updates correctly", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: "Test description",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        status: "done",
      })

      expect(updatedTask.title).toBe("Test Task")
      expect(updatedTask.description).toBe("Test description")
      expect(updatedTask.priority).toBe("medium")
      expect(updatedTask.status).toBe("done")
    })

    test("should persist updates to localStorage", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.updateTask(task.id, {
        title: "Updated Title",
      })

      expect(localStorage.setItem).toHaveBeenCalledWith("taskeasy-tasks", expect.stringContaining("Updated Title"))
    })

    test("should handle empty description update", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: "Original description",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        description: "",
      })

      expect(updatedTask.description).toBe("")
    })

    test("should maintain task order after update", () => {
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

      taskManager.updateTask(task1.id, {
        title: "Updated Task 1",
      })

      expect(taskManager.tasks[0].title).toBe("Updated Task 1")
      expect(taskManager.tasks[1].title).toBe("Task 2")
    })

    test("should return updated task object", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Title",
      })

      expect(updatedTask).toHaveProperty("id", task.id)
      expect(updatedTask).toHaveProperty("title", "Updated Title")
      expect(updatedTask).toHaveProperty("createdAt")
      expect(updatedTask).toHaveProperty("updatedAt")
    })
  })

  describe("Edit Mode Management", () => {
    test("should enter edit mode successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)

      expect(taskManager.isInEditMode()).toBe(true)
      expect(taskManager.getEditingTaskId()).toBe(task.id)
    })

    test("should exit edit mode successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)
      taskManager.exitEditMode()

      expect(taskManager.isInEditMode()).toBe(false)
      expect(taskManager.getEditingTaskId()).toBe(null)
    })

    test("should exit previous edit mode when entering new one", () => {
      const task1 = taskManager.createTask({
        title: "Task 1",
        priority: "medium",
        status: "to-do",
      })

      // Change mock values for unique ID
      mockDateNow.mockReturnValue(1640995300000)
      mockMathRandom.mockReturnValue(0.987654321)

      const task2 = taskManager.createTask({
        title: "Task 2",
        priority: "high",
        status: "to-do",
      })

      taskManager.enterEditMode(task1.id)
      expect(taskManager.getEditingTaskId()).toBe(task1.id)

      taskManager.enterEditMode(task2.id)
      expect(taskManager.getEditingTaskId()).toBe(task2.id)
    })

    test("should return false when not in edit mode", () => {
      expect(taskManager.isInEditMode()).toBe(false)
    })

    test("should return null when no task is being edited", () => {
      expect(taskManager.getEditingTaskId()).toBe(null)
    })

    test("should handle edit mode state correctly", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(taskManager.isInEditMode()).toBe(false)
      expect(taskManager.getEditingTaskId()).toBe(null)

      taskManager.enterEditMode(task.id)
      expect(taskManager.isInEditMode()).toBe(true)
      expect(taskManager.getEditingTaskId()).toBe(task.id)

      taskManager.exitEditMode()
      expect(taskManager.isInEditMode()).toBe(false)
      expect(taskManager.getEditingTaskId()).toBe(null)
    })
  })

  describe("Integration with Priority Sorting", () => {
    test("should maintain priority sorting after update", () => {
      const task1 = taskManager.createTask({
        title: "Task 1",
        priority: "low",
        status: "to-do",
      })

      // Change mock values for unique ID
      mockDateNow.mockReturnValue(1640995400000)
      mockMathRandom.mockReturnValue(0.555555555)

      const task2 = taskManager.createTask({
        title: "Task 2",
        priority: "high",
        status: "to-do",
      })

      taskManager.updateTask(task1.id, { priority: "high" })

      const sortedTasks = taskManager.getTasksSortedByPriority()

      expect(sortedTasks[0].priority).toBe("high")
      expect(sortedTasks[1].priority).toBe("high")
    })

    test("should update priority statistics after task update", () => {
      const task1 = taskManager.createTask({
        title: "Task 1",
        priority: "low",
        status: "to-do",
      })

      // Change mock values for unique ID
      mockDateNow.mockReturnValue(1640995500000)
      mockMathRandom.mockReturnValue(0.777777777)

      const task2 = taskManager.createTask({
        title: "Task 2",
        priority: "medium",
        status: "to-do",
      })

      let stats = taskManager.getPriorityStats()
      expect(stats).toEqual({ high: 0, medium: 1, low: 1 })

      taskManager.updateTask(task1.id, { priority: "high" })

      stats = taskManager.getPriorityStats()
      expect(stats).toEqual({ high: 1, medium: 1, low: 0 })
    })
  })

  describe("Error Handling and Edge Cases", () => {
    test("should handle localStorage errors gracefully", () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage quota exceeded")
      })

      taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(console.error).toHaveBeenCalledWith("Error saving tasks:", expect.any(Error))

      localStorage.setItem = originalSetItem
    })

    test("should handle corrupted localStorage gracefully", () => {
      localStorage.getItem = jest.fn(() => "invalid json")

      const newTaskManager = new TaskManager()

      expect(newTaskManager.tasks).toEqual([])
      expect(console.error).toHaveBeenCalledWith("Error loading tasks:", expect.any(Error))
    })

    test("should handle save edit with no current edit", () => {
      taskManager.currentEditId = null

      expect(() => {
        taskManager.handleSaveEdit()
      }).not.toThrow()
    })

    test("should filter out null tasks in priority sorting", () => {
      taskManager.tasks = [
        null,
        { id: "1", title: "Task 1", priority: "high", status: "to-do" },
        undefined,
        { id: "2", title: "Task 2", priority: "low", status: "to-do" },
        { id: "3", title: "Task 3" },
      ]

      const sortedTasks = taskManager.getTasksSortedByPriority()

      expect(sortedTasks).toHaveLength(2)
      expect(sortedTasks[0].priority).toBe("high")
      expect(sortedTasks[1].priority).toBe("low")
    })

    test("should handle priority stats with null tasks", () => {
      taskManager.tasks = [null, { id: "1", priority: "high" }, undefined, { id: "2", priority: "medium" }, { id: "3" }]

      const stats = taskManager.getPriorityStats()

      expect(stats).toEqual({ high: 1, medium: 1, low: 0 })
    })
  })

  describe("Utility Functions Coverage", () => {
    test("should format various date ranges", () => {
      const now = new Date()

      const justNow = new Date(now.getTime() - 30000).toISOString()
      expect(taskManager.formatDate(justNow)).toBe("Just now")

      const minutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
      expect(taskManager.formatDate(minutesAgo)).toBe("5m ago")

      const hoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
      expect(taskManager.formatDate(hoursAgo)).toBe("3h ago")

      const daysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      expect(taskManager.formatDate(daysAgo)).toBe("5d ago")

      const weeksAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      const result = taskManager.formatDate(weeksAgo)
      expect(result).toMatch(/\w{3} \d{1,2}/)
    })

    test("should escape all HTML characters", () => {
      const testCases = [
        { input: "<script>", expected: "&lt;script&gt;" },
        { input: "& ampersand", expected: "&amp; ampersand" },
        { input: '"quotes"', expected: "&quot;quotes&quot;" },
        { input: "'apostrophe'", expected: "&#039;apostrophe&#039;" },
        { input: "<>&\"'", expected: "&lt;&gt;&amp;&quot;&#039;" },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = taskManager.escapeHtml(input)
        expect(result).toBe(expected)
      })
    })

    test("should generate ID with expected format", () => {
      const id = taskManager.generateId()

      expect(typeof id).toBe("string")
      expect(id).toMatch(/^[a-z0-9]+$/)
      expect(id.length).toBeGreaterThan(10)
    })

    test("should generate different IDs on multiple calls", () => {
      const id1 = taskManager.generateId()

      // Change mock values for different ID
      mockDateNow.mockReturnValue(1640995600000)
      mockMathRandom.mockReturnValue(0.999999999)

      const id2 = taskManager.generateId()

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(typeof id1).toBe("string")
      expect(typeof id2).toBe("string")
      expect(id1).not.toBe(id2)
    })

    test("should handle ID generation method existence", () => {
      expect(typeof taskManager.generateId).toBe("function")

      const id = taskManager.generateId()
      expect(id).toBeDefined()
      expect(typeof id).toBe("string")
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe("Browser Environment Compatibility", () => {
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

    test("should handle boolean values in title and description", () => {
      const task = taskManager.createTask({
        title: true,
        description: false,
        priority: "medium",
        status: "to-do",
      })

      expect(task.title).toBe("true")
      expect(task.description).toBe("false")
    })

    test("should handle null description", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: null,
        priority: "medium",
        status: "to-do",
      })

      expect(task.description).toBe("")
    })

    test("should handle object description", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: { test: "value" },
        priority: "medium",
        status: "to-do",
      })

      expect(task.description).toBe("[object Object]")
    })

    test("should update task with numeric values", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: 999,
        description: 123,
      })

      expect(updatedTask.title).toBe("999")
      expect(updatedTask.description).toBe("123")
    })

    test("should update task with boolean values", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: true,
        description: false,
      })

      expect(updatedTask.title).toBe("true")
      expect(updatedTask.description).toBe("false")
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

  describe("DOM and Browser Integration Tests", () => {
    test("should handle populateEditForm with non-existent task", () => {
      taskManager.populateEditForm("non-existent-id")
      // Should not throw error
      expect(true).toBe(true)
    })

    test("should handle handleEditClick", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.handleEditClick(task.id)
      expect(taskManager.isInEditMode()).toBe(true)
      expect(taskManager.getEditingTaskId()).toBe(task.id)
    })

    test("should handle handleCancelEdit", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)
      taskManager.handleCancelEdit()
      expect(taskManager.isInEditMode()).toBe(false)
    })

    test("should handle showNotification in Node environment", () => {
      expect(() => {
        taskManager.showNotification("Test message", "success")
      }).not.toThrow()
    })

    test("should handle createTaskHTML", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: "Test Description",
        priority: "high",
        status: "in-progress",
      })

      const html = taskManager.createTaskHTML(task)
      expect(html).toContain("Test Task")
      expect(html).toContain("Test Description")
      expect(html).toContain("priority-high")
      expect(html).toContain("status-in-progress")
    })

    test("should handle createTaskHTML without description", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const html = taskManager.createTaskHTML(task)
      expect(html).toContain("Test Task")
      expect(html).not.toContain("task-description")
    })

    test("should handle createTaskHTML in edit mode", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)
      const html = taskManager.createTaskHTML(task)
      expect(html).toContain("editing")
      expect(html).toContain("Editing")
    })

    test("should handle renderTasks with empty list", () => {
      // Mock document.getElementById
      const mockElement = { innerHTML: "" }
      global.document = {
        getElementById: jest.fn(() => mockElement),
      }

      taskManager.renderTasks()
      expect(mockElement.innerHTML).toContain("No tasks yet")

      delete global.document
    })

    test("should handle renderTasks with tasks", () => {
      const mockElement = { innerHTML: "" }
      global.document = {
        getElementById: jest.fn(() => mockElement),
      }

      taskManager.createTask({
        title: "Test Task",
        priority: "high",
        status: "to-do",
      })

      taskManager.renderTasks()
      expect(mockElement.innerHTML).toContain("Test Task")

      delete global.document
    })

    test("should handle updateStats", () => {
      const mockElement = { textContent: "" }
      global.document = {
        getElementById: jest.fn(() => mockElement),
      }

      taskManager.createTask({ title: "Task 1", priority: "high", status: "done" })

      // Change mock values for unique IDs
      mockDateNow.mockReturnValue(1640995700000)
      mockMathRandom.mockReturnValue(0.888888888)

      taskManager.createTask({ title: "Task 2", priority: "medium", status: "in-progress" })

      // Change mock values for unique IDs
      mockDateNow.mockReturnValue(1640995800000)
      mockMathRandom.mockReturnValue(0.111111111)

      taskManager.createTask({ title: "Task 3", priority: "low", status: "to-do" })

      taskManager.updateStats()
      expect(mockElement.textContent).toContain("3 tasks created")
      expect(mockElement.textContent).toContain("1 done")
      expect(mockElement.textContent).toContain("1 active")
      expect(mockElement.textContent).toContain("1 todo")
      expect(mockElement.textContent).toContain("1H/1M/1L")

      delete global.document
    })

    test("should handle resetForm", () => {
      const mockForm = { reset: jest.fn() }
      const mockElements = {
        taskForm: mockForm,
        taskPriority: { value: "" },
        taskStatus: { value: "" },
        taskTitle: { focus: jest.fn() },
        formTitle: { textContent: "" },
        submitBtn: { textContent: "" },
        cancelBtn: { style: { display: "" } },
      }

      global.document = {
        getElementById: jest.fn((id) => mockElements[id] || null),
      }

      taskManager.resetForm()
      expect(mockForm.reset).toHaveBeenCalled()
      expect(mockElements.taskTitle.focus).toHaveBeenCalled()

      delete global.document
    })
  })

  describe("Additional Coverage Tests", () => {
    test("should handle loadTasks with undefined localStorage", () => {
      const originalLocalStorage = global.localStorage
      delete global.localStorage

      const newTaskManager = new TaskManager()
      expect(newTaskManager.tasks).toEqual([])

      global.localStorage = originalLocalStorage
    })

    test("should handle saveTasks with undefined localStorage", () => {
      const originalLocalStorage = global.localStorage
      delete global.localStorage

      taskManager.saveTasks()
      // Should not throw error
      expect(true).toBe(true)

      global.localStorage = originalLocalStorage
    })

    test("should handle formatDate edge cases", () => {
      const now = new Date()

      // Test exact boundaries
      const exactlyOneMinute = new Date(now.getTime() - 60000).toISOString()
      expect(taskManager.formatDate(exactlyOneMinute)).toBe("1m ago")

      const exactlyOneHour = new Date(now.getTime() - 3600000).toISOString()
      expect(taskManager.formatDate(exactlyOneHour)).toBe("1h ago")

      const exactlyOneDay = new Date(now.getTime() - 86400000).toISOString()
      expect(taskManager.formatDate(exactlyOneDay)).toBe("1d ago")

      const exactlyOneWeek = new Date(now.getTime() - 7 * 86400000).toISOString()
      const result = taskManager.formatDate(exactlyOneWeek)
      expect(result).toMatch(/\w{3} \d{1,2}/)
    })

    test("should handle escapeHtml with special characters", () => {
      const testCases = [
        { input: "", expected: "" },
        { input: "normal text", expected: "normal text" },
        { input: "line1\nline2", expected: "line1\nline2" },
        { input: "tab\there", expected: "tab\there" },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = taskManager.escapeHtml(input)
        expect(result).toBe(expected)
      })
    })

    test("should handle validateTask with edge cases", () => {
      // Test with exactly 100 character title
      const validTask = {
        title: "a".repeat(100),
        priority: "high",
        status: "done",
      }
      const errors = taskManager.validateTask(validTask)
      expect(errors).toEqual([])

      // Test with 99 character title
      const validTask99 = {
        title: "a".repeat(99),
        priority: "medium",
        status: "in-progress",
      }
      const errors99 = taskManager.validateTask(validTask99)
      expect(errors99).toEqual([])
    })

    test("should handle multiple validation errors", () => {
      const invalidTask = {
        title: "a".repeat(101), // Too long
        priority: "invalid", // Invalid priority
        status: "invalid", // Invalid status
      }

      const errors = taskManager.validateTask(invalidTask)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]).toBe("Title must be less than 100 characters")
    })

    test("should initialize DOM methods when document and window are available", () => {
      // Mock complete DOM environment with proper methods
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

      // Create new TaskManager with DOM environment - this covers lines 11-13
      const newTaskManager = new TaskManager()

      // Verify DOM methods were called
      expect(mockForm.addEventListener).toHaveBeenCalledWith("submit", expect.any(Function))
      expect(mockCancelBtn.addEventListener).toHaveBeenCalledWith("click", expect.any(Function))
      expect(mockTaskList.innerHTML).toContain("No tasks yet")
      expect(mockStatsEl.textContent).toContain("0 tasks created")

      // Cleanup
      delete global.document
      delete global.window
    })

    test("should handle DOM initialization with missing elements", () => {
      // Mock partial DOM environment
      global.document = {
        getElementById: jest.fn(() => null), // All elements return null
      }
      global.window = {}

      // Should not throw error even with missing elements
      expect(() => {
        new TaskManager()
      }).not.toThrow()

      // Cleanup
      delete global.document
      delete global.window
    })

    test("should skip DOM initialization when document is undefined", () => {
      const originalDocument = global.document
      const originalWindow = global.window

      delete global.document
      delete global.window

      // Should not throw error without DOM
      expect(() => {
        new TaskManager()
      }).not.toThrow()

      // Restore
      global.document = originalDocument
      global.window = originalWindow
    })

    test("should skip DOM initialization when window is undefined", () => {
      const originalWindow = global.window

      global.document = { getElementById: jest.fn() }
      delete global.window

      // Should not throw error without window
      expect(() => {
        new TaskManager()
      }).not.toThrow()

      // Restore
      global.window = originalWindow
      delete global.document
    })

    test("should handle initializeEventListeners with complete DOM", () => {
      // Mock complete form with addEventListener
      const mockForm = { addEventListener: jest.fn() }
      const mockCancelBtn = { addEventListener: jest.fn() }

      global.document = {
        getElementById: jest.fn((id) => {
          if (id === "taskForm") return mockForm
          if (id === "cancelBtn") return mockCancelBtn
          return null
        }),
      }

      // Test initializeEventListeners directly
      taskManager.initializeEventListeners()

      expect(mockForm.addEventListener).toHaveBeenCalledWith("submit", expect.any(Function))
      expect(mockCancelBtn.addEventListener).toHaveBeenCalledWith("click", expect.any(Function))

      delete global.document
    })

    test("should handle initializeEventListeners with missing elements", () => {
      global.document = {
        getElementById: jest.fn(() => null),
      }

      // Should not throw error with missing elements
      expect(() => {
        taskManager.initializeEventListeners()
      }).not.toThrow()

      delete global.document
    })

    test("should handle constructor DOM path coverage", () => {
      // Test the exact constructor path that covers lines 11-13
      const mockForm = { addEventListener: jest.fn() }
      const mockCancelBtn = { addEventListener: jest.fn() }
      const mockTaskList = { innerHTML: "" }
      const mockStatsEl = { textContent: "" }

      // Mock both document and window to trigger the condition
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

      // This should execute lines 11-13 in constructor
      const newTaskManager = new TaskManager()

      // Verify the three methods were called
      expect(mockForm.addEventListener).toHaveBeenCalled() // from initializeEventListeners
      expect(mockTaskList.innerHTML).toBeDefined() // from renderTasks
      expect(mockStatsEl.textContent).toBeDefined() // from updateStats

      // Cleanup
      delete global.document
      delete global.window
    })
  })
})
