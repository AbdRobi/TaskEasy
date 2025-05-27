// Day 4 Tests - US3: Update Tasks
// TDD Approach: Write tests first for update functionality

const { TaskManager } = require("../TaskManager.js");

describe("TaskManager - Day 4: US3 Update Tasks", () => {
  let taskManager

  beforeEach(() => {
    localStorage.clear()
    taskManager = new TaskManager()
  })

  describe("US3: Update Task Functionality", () => {
    test("should update task title successfully", () => {
      // Create initial task
      const task = taskManager.createTask({
        title: "Original Title",
        description: "Original Description",
        priority: "medium",
        status: "to-do",
      })

      // Update task title
      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Title",
      })

      expect(updatedTask.title).toBe("Updated Title")
      expect(updatedTask.description).toBe("Original Description") // Should remain unchanged
      expect(updatedTask.priority).toBe("medium") // Should remain unchanged
    })

    test("should update task description successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        description: "Original Description",
        priority: "high",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        description: "Updated Description",
      })

      expect(updatedTask.description).toBe("Updated Description")
      expect(updatedTask.title).toBe("Test Task") // Should remain unchanged
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
      expect(updatedTask.title).toBe("Test Task") // Should remain unchanged
    })

    test("should update task status successfully", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        status: "in-progress",
      })

      expect(updatedTask.status).toBe("in-progress")
      expect(updatedTask.priority).toBe("medium") // Should remain unchanged
    })

    test("should update multiple fields at once", () => {
      const task = taskManager.createTask({
        title: "Original Task",
        description: "Original Description",
        priority: "low",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: "Updated Task",
        priority: "high",
        status: "in-progress",
      })

      expect(updatedTask.title).toBe("Updated Task")
      expect(updatedTask.priority).toBe("high")
      expect(updatedTask.status).toBe("in-progress")
      expect(updatedTask.description).toBe("Original Description") // Should remain unchanged
    })

    test("should update timestamp when task is modified", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const originalUpdatedAt = task.updatedAt

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        const updatedTask = taskManager.updateTask(task.id, {
          title: "Updated Title",
        })

        expect(updatedTask.updatedAt).not.toBe(originalUpdatedAt)
        expect(new Date(updatedTask.updatedAt)).toBeInstanceOf(Date)
      }, 10)
    })

    test("should preserve createdAt timestamp when updating", () => {
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

    test("should save updated task to localStorage", () => {
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
  })

  describe("Update Validation", () => {
    test("should throw error when updating non-existent task", () => {
      expect(() => {
        taskManager.updateTask("non-existent-id", {
          title: "Updated Title",
        })
      }).toThrow("Task not found")
    })

    test("should validate title when updating", () => {
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

      expect(() => {
        taskManager.updateTask(task.id, {
          title: "a".repeat(101),
        })
      }).toThrow("Title too long")
    })

    test("should validate priority when updating", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(() => {
        taskManager.updateTask(task.id, {
          priority: "invalid-priority",
        })
      }).toThrow("Invalid priority")
    })

    test("should validate status when updating", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      expect(() => {
        taskManager.updateTask(task.id, {
          status: "invalid-status",
        })
      }).toThrow("Invalid status")
    })

    test("should allow partial updates with valid data", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      // Should not throw error
      expect(() => {
        taskManager.updateTask(task.id, {
          priority: "high",
        })
      }).not.toThrow()
    })

    test("should trim whitespace in updated fields", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      const updatedTask = taskManager.updateTask(task.id, {
        title: "  Updated Title  ",
        description: "  Updated Description  ",
      })

      expect(updatedTask.title).toBe("Updated Title")
      expect(updatedTask.description).toBe("Updated Description")
    })
  })

  describe("Edit Mode Functionality", () => {
    test("should enter edit mode for a task", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)

      expect(taskManager.currentEditId).toBe(task.id)
      expect(taskManager.isInEditMode()).toBe(true)
      expect(taskManager.getEditingTaskId()).toBe(task.id)
    })

    test("should exit edit mode", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)
      expect(taskManager.isInEditMode()).toBe(true)

      taskManager.exitEditMode()
      expect(taskManager.isInEditMode()).toBe(false)
      expect(taskManager.currentEditId).toBeNull()
    })

    test("should only allow one task in edit mode at a time", () => {
      const task1 = taskManager.createTask({
        title: "Task 1",
        priority: "medium",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "Task 2",
        priority: "high",
        status: "to-do",
      })

      taskManager.enterEditMode(task1.id)
      expect(taskManager.getEditingTaskId()).toBe(task1.id)

      taskManager.enterEditMode(task2.id)
      expect(taskManager.getEditingTaskId()).toBe(task2.id)
      expect(taskManager.getEditingTaskId()).not.toBe(task1.id)
    })

    test("should get task being edited", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.enterEditMode(task.id)
      const editingTask = taskManager.getEditingTask()

      expect(editingTask).toEqual(task)
    })

    test("should return null when no task is being edited", () => {
      const editingTask = taskManager.getEditingTask()
      expect(editingTask).toBeNull()
    })
  })

  describe("Integration with Existing Features", () => {
    test("should maintain priority sorting after update", () => {
      const task1 = taskManager.createTask({
        title: "Low Priority Task",
        priority: "low",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "Medium Priority Task",
        priority: "medium",
        status: "to-do",
      })

      // Update first task to high priority
      taskManager.updateTask(task1.id, {
        priority: "high",
      })

      const sortedTasks = taskManager.getTasksSortedByPriority()

      expect(sortedTasks[0].id).toBe(task1.id) // Should be first now (high priority)
      expect(sortedTasks[1].id).toBe(task2.id) // Should be second (medium priority)
    })

    test("should update statistics after task update", () => {
      taskManager.createTask({
        title: "Task 1",
        priority: "high",
        status: "to-do",
      })

      taskManager.createTask({
        title: "Task 2",
        priority: "medium",
        status: "to-do",
      })

      let stats = taskManager.getPriorityStats()
      expect(stats.high).toBe(1)
      expect(stats.medium).toBe(1)
      expect(stats.low).toBe(0)

      // Update medium priority task to low priority
      const tasks = taskManager.getAllTasks()
      taskManager.updateTask(tasks[1].id, {
        priority: "low",
      })

      stats = taskManager.getPriorityStats()
      expect(stats.high).toBe(1)
      expect(stats.medium).toBe(0)
      expect(stats.low).toBe(1)
    })
  })
})
