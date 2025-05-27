// Day 3 Tests - US2: View Tasks Sorted by Priority
// TDD Approach: Write tests first for sorting functionality

const { TaskManager } = require("../TaskManager.js");

describe("TaskManager - Day 3: US2 View Tasks Sorted by Priority", () => {
  let taskManager

  beforeEach(() => {
    localStorage.clear()
    taskManager = new TaskManager()
  })

  describe("US2: Sort Tasks by Priority", () => {
    test("should sort tasks by priority: high, medium, low", () => {
      // Create tasks in mixed priority order
      const task1 = taskManager.createTask({
        title: "Low Priority Task",
        priority: "low",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "High Priority Task",
        priority: "high",
        status: "to-do",
      })

      const task3 = taskManager.createTask({
        title: "Medium Priority Task",
        priority: "medium",
        status: "to-do",
      })

      const sortedTasks = taskManager.getTasksSortedByPriority()

      expect(sortedTasks).toHaveLength(3)
      expect(sortedTasks[0].priority).toBe("high")
      expect(sortedTasks[0].title).toBe("High Priority Task")
      expect(sortedTasks[1].priority).toBe("medium")
      expect(sortedTasks[1].title).toBe("Medium Priority Task")
      expect(sortedTasks[2].priority).toBe("low")
      expect(sortedTasks[2].title).toBe("Low Priority Task")
    })

    test("should maintain creation order within same priority", () => {
      // Create multiple tasks with same priority
      const task1 = taskManager.createTask({
        title: "First High Priority",
        priority: "high",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "Second High Priority",
        priority: "high",
        status: "to-do",
      })

      const task3 = taskManager.createTask({
        title: "Third High Priority",
        priority: "high",
        status: "to-do",
      })

      const sortedTasks = taskManager.getTasksSortedByPriority()

      expect(sortedTasks[0].title).toBe("First High Priority")
      expect(sortedTasks[1].title).toBe("Second High Priority")
      expect(sortedTasks[2].title).toBe("Third High Priority")
    })

    test("should handle empty task list", () => {
      const sortedTasks = taskManager.getTasksSortedByPriority()
      expect(sortedTasks).toEqual([])
    })

    test("should handle single task", () => {
      const task = taskManager.createTask({
        title: "Only Task",
        priority: "medium",
        status: "to-do",
      })

      const sortedTasks = taskManager.getTasksSortedByPriority()
      expect(sortedTasks).toHaveLength(1)
      expect(sortedTasks[0]).toEqual(task)
    })

    test("should sort mixed priorities correctly", () => {
      // Create tasks with all priority combinations
      const tasks = [
        { title: "Task 1", priority: "medium" },
        { title: "Task 2", priority: "low" },
        { title: "Task 3", priority: "high" },
        { title: "Task 4", priority: "low" },
        { title: "Task 5", priority: "high" },
        { title: "Task 6", priority: "medium" },
      ]

      tasks.forEach((taskData) => {
        taskManager.createTask({
          ...taskData,
          status: "to-do",
        })
      })

      const sortedTasks = taskManager.getTasksSortedByPriority()

      // Check priority order
      const priorities = sortedTasks.map((task) => task.priority)
      const expectedOrder = ["high", "high", "medium", "medium", "low", "low"]
      expect(priorities).toEqual(expectedOrder)

      // Check that high priority tasks come first
      expect(sortedTasks[0].title).toBe("Task 3")
      expect(sortedTasks[1].title).toBe("Task 5")
    })
  })

  describe("Priority Filtering and Display", () => {
    test("should get tasks by specific priority", () => {
      taskManager.createTask({ title: "High 1", priority: "high", status: "to-do" })
      taskManager.createTask({ title: "Medium 1", priority: "medium", status: "to-do" })
      taskManager.createTask({ title: "High 2", priority: "high", status: "to-do" })
      taskManager.createTask({ title: "Low 1", priority: "low", status: "to-do" })

      const highPriorityTasks = taskManager.getTasksByPriority("high")
      expect(highPriorityTasks).toHaveLength(2)
      expect(highPriorityTasks.every((task) => task.priority === "high")).toBe(true)

      const mediumPriorityTasks = taskManager.getTasksByPriority("medium")
      expect(mediumPriorityTasks).toHaveLength(1)
      expect(mediumPriorityTasks[0].title).toBe("Medium 1")
    })

    test("should get priority statistics", () => {
      taskManager.createTask({ title: "High 1", priority: "high", status: "to-do" })
      taskManager.createTask({ title: "High 2", priority: "high", status: "done" })
      taskManager.createTask({ title: "Medium 1", priority: "medium", status: "to-do" })
      taskManager.createTask({ title: "Low 1", priority: "low", status: "in-progress" })

      const stats = taskManager.getPriorityStats()
      expect(stats).toEqual({
        high: 2,
        medium: 1,
        low: 1,
        total: 4,
      })
    })
  })

  describe("Refactoring: Improved Task Management", () => {
    test("should validate priority values in helper function", () => {
      expect(taskManager.isValidPriority("high")).toBe(true)
      expect(taskManager.isValidPriority("medium")).toBe(true)
      expect(taskManager.isValidPriority("low")).toBe(true)
      expect(taskManager.isValidPriority("invalid")).toBe(false)
      expect(taskManager.isValidPriority("")).toBe(false)
      expect(taskManager.isValidPriority(null)).toBe(false)
    })

    test("should get priority order value", () => {
      expect(taskManager.getPriorityOrder("high")).toBe(1)
      expect(taskManager.getPriorityOrder("medium")).toBe(2)
      expect(taskManager.getPriorityOrder("low")).toBe(3)
      expect(taskManager.getPriorityOrder("invalid")).toBe(999)
    })

    test("should format priority display text", () => {
      expect(taskManager.formatPriorityText("high")).toBe("🔴 High Priority")
      expect(taskManager.formatPriorityText("medium")).toBe("🟡 Medium Priority")
      expect(taskManager.formatPriorityText("low")).toBe("🟢 Low Priority")
    })
  })

  describe("Performance and Edge Cases", () => {
    test("should handle large number of tasks efficiently", () => {
      // Create 100 tasks with random priorities
      const priorities = ["high", "medium", "low"]
      const startTime = performance.now()

      for (let i = 0; i < 100; i++) {
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]
        taskManager.createTask({
          title: `Task ${i}`,
          priority: randomPriority,
          status: "to-do",
        })
      }

      const sortedTasks = taskManager.getTasksSortedByPriority()
      const endTime = performance.now()

      expect(sortedTasks).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms

      // Verify sorting is correct
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const currentPriority = taskManager.getPriorityOrder(sortedTasks[i].priority)
        const nextPriority = taskManager.getPriorityOrder(sortedTasks[i + 1].priority)
        expect(currentPriority).toBeLessThanOrEqual(nextPriority)
      }
    })

    test("should not mutate original tasks array when sorting", () => {
      taskManager.createTask({ title: "Task 1", priority: "low", status: "to-do" })
      taskManager.createTask({ title: "Task 2", priority: "high", status: "to-do" })

      const originalOrder = taskManager.getAllTasks().map((task) => task.title)
      const sortedTasks = taskManager.getTasksSortedByPriority()
      const afterSortOrder = taskManager.getAllTasks().map((task) => task.title)

      expect(originalOrder).toEqual(afterSortOrder)
      expect(sortedTasks[0].title).toBe("Task 2") // High priority first
      expect(originalOrder[0]).toBe("Task 1") // Original order preserved
    })
  })
})
