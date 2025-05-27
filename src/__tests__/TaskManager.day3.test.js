const TaskManager = require("../TaskManager.js")

describe("TaskManager - Day 3: US2 View Tasks Sorted by Priority", () => {
  let taskManager

  beforeEach(() => {
    localStorage.clear()
    localStorage.getItem.mockClear()
    localStorage.setItem.mockClear()
    console.log.mockClear()
    console.error.mockClear()

    taskManager = new TaskManager()
  })

  describe("US2: Sort Tasks by Priority", () => {
    test("should sort tasks by priority: high, medium, low", () => {
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

      const priorities = sortedTasks.map((task) => task.priority)
      const expectedOrder = ["high", "high", "medium", "medium", "low", "low"]
      expect(priorities).toEqual(expectedOrder)

      expect(sortedTasks[0].title).toBe("Task 3")
      expect(sortedTasks[1].title).toBe("Task 5")
    })
  })

  describe("Priority Statistics", () => {
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
      })
    })

    test("should handle empty stats", () => {
      const stats = taskManager.getPriorityStats()
      expect(stats).toEqual({
        high: 0,
        medium: 0,
        low: 0,
      })
    })
  })

  describe("Performance Tests", () => {
    test("should handle large number of tasks efficiently", () => {
      const priorities = ["high", "medium", "low"]
      const startTime = Date.now()

      for (let i = 0; i < 50; i++) {
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]
        taskManager.createTask({
          title: `Task ${i}`,
          priority: randomPriority,
          status: "to-do",
        })
      }

      const sortedTasks = taskManager.getTasksSortedByPriority()
      const endTime = Date.now()

      expect(sortedTasks).toHaveLength(50)
      expect(endTime - startTime).toBeLessThan(100)

      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const currentPriority = { high: 1, medium: 2, low: 3 }[sortedTasks[i].priority]
        const nextPriority = { high: 1, medium: 2, low: 3 }[sortedTasks[i + 1].priority]
        expect(currentPriority).toBeLessThanOrEqual(nextPriority)
      }
    })

    test("should not mutate original tasks array when sorting", () => {
      taskManager.createTask({ title: "Task 1", priority: "low", status: "to-do" })
      taskManager.createTask({ title: "Task 2", priority: "high", status: "to-do" })

      const originalOrder = taskManager.tasks.map((task) => task.title)
      const sortedTasks = taskManager.getTasksSortedByPriority()
      const afterSortOrder = taskManager.tasks.map((task) => task.title)

      expect(originalOrder).toEqual(afterSortOrder)
      expect(sortedTasks[0].title).toBe("Task 2")
      expect(originalOrder[0]).toBe("Task 1")
    })
  })

  describe("Advanced Priority Sorting Edge Cases", () => {
    test("should handle tasks with mixed data types", () => {
      taskManager.tasks = [
        { id: "1", title: "Task 1", priority: "high", status: "to-do" },
        { id: "2", title: "Task 2", priority: "medium", status: "to-do" },
        { id: "3", title: "Task 3", priority: "low", status: "to-do" },
        { id: "4", title: "Task 4", priority: "high", status: "to-do" },
      ]

      const sortedTasks = taskManager.getTasksSortedByPriority()

      expect(sortedTasks).toHaveLength(4)
      expect(sortedTasks[0].priority).toBe("high")
      expect(sortedTasks[1].priority).toBe("high")
      expect(sortedTasks[2].priority).toBe("medium")
      expect(sortedTasks[3].priority).toBe("low")
    })

    test("should maintain stable sort for same priorities", () => {
      const tasks = []
      for (let i = 0; i < 5; i++) {
        tasks.push(
          taskManager.createTask({
            title: `High Priority Task ${i}`,
            priority: "high",
            status: "to-do",
          }),
        )
      }

      const sortedTasks = taskManager.getTasksSortedByPriority()

      for (let i = 0; i < 5; i++) {
        expect(sortedTasks[i].title).toBe(`High Priority Task ${i}`)
      }
    })

    test("should handle empty priority stats correctly", () => {
      const stats = taskManager.getPriorityStats()
      expect(stats.high).toBe(0)
      expect(stats.medium).toBe(0)
      expect(stats.low).toBe(0)
    })

    test("should handle large datasets efficiently", () => {
      const startTime = Date.now()

      for (let i = 0; i < 100; i++) {
        const priorities = ["high", "medium", "low"]
        const randomPriority = priorities[i % 3]
        taskManager.createTask({
          title: `Task ${i}`,
          priority: randomPriority,
          status: "to-do",
        })
      }

      const sortedTasks = taskManager.getTasksSortedByPriority()
      const endTime = Date.now()

      expect(sortedTasks).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(50)

      let lastPriorityValue = 0
      const priorityValues = { high: 1, medium: 2, low: 3 }

      sortedTasks.forEach((task) => {
        const currentPriorityValue = priorityValues[task.priority]
        expect(currentPriorityValue).toBeGreaterThanOrEqual(lastPriorityValue)
        lastPriorityValue = currentPriorityValue
      })
    })

    test("should not modify original array during sorting", () => {
      taskManager.createTask({ title: "Task A", priority: "low", status: "to-do" })
      taskManager.createTask({ title: "Task B", priority: "high", status: "to-do" })
      taskManager.createTask({ title: "Task C", priority: "medium", status: "to-do" })

      const originalOrder = taskManager.tasks.map((task) => task.title)
      const sortedTasks = taskManager.getTasksSortedByPriority()
      const afterSortOrder = taskManager.tasks.map((task) => task.title)

      expect(originalOrder).toEqual(afterSortOrder)
      expect(sortedTasks[0].title).toBe("Task B")
      expect(originalOrder[0]).toBe("Task A")
    })

    test("should handle priority stats with all same priority", () => {
      for (let i = 0; i < 5; i++) {
        taskManager.createTask({
          title: `Task ${i}`,
          priority: "medium",
          status: "to-do",
        })
      }

      const stats = taskManager.getPriorityStats()
      expect(stats).toEqual({ high: 0, medium: 5, low: 0 })
    })

    test("should handle priority stats with mixed statuses", () => {
      const statuses = ["to-do", "in-progress", "done"]
      const priorities = ["high", "medium", "low"]

      for (let i = 0; i < 9; i++) {
        taskManager.createTask({
          title: `Task ${i}`,
          priority: priorities[i % 3],
          status: statuses[i % 3],
        })
      }

      const stats = taskManager.getPriorityStats()
      expect(stats).toEqual({ high: 3, medium: 3, low: 3 })
    })
  })

  describe("Performance and Memory Tests", () => {
    test("should handle rapid task creation", () => {
      const startTime = Date.now()

      for (let i = 0; i < 50; i++) {
        taskManager.createTask({
          title: `Rapid Task ${i}`,
          priority: "medium",
          status: "to-do",
        })
      }

      const endTime = Date.now()
      expect(endTime - startTime).toBeLessThan(100)
      expect(taskManager.tasks).toHaveLength(50)
    })

    test("should handle memory efficiently with large descriptions", () => {
      const largeDescription = "A".repeat(1000)

      for (let i = 0; i < 10; i++) {
        taskManager.createTask({
          title: `Large Task ${i}`,
          description: largeDescription,
          priority: "medium",
          status: "to-do",
        })
      }

      expect(taskManager.tasks).toHaveLength(10)
      expect(taskManager.tasks[0].description).toHaveLength(1000)
    })
  })

  describe("Additional Coverage for Day 3", () => {
    test("should handle getTasksSortedByPriority with null/undefined tasks", () => {
      // Manually add some problematic tasks
      taskManager.tasks = [
        null,
        undefined,
        { id: "1", title: "Valid Task", priority: "high", status: "to-do" },
        { id: "2", title: "No Priority" }, // Missing priority
        { id: "3", title: "Valid Task 2", priority: "low", status: "done" },
      ]

      const sortedTasks = taskManager.getTasksSortedByPriority()

      // Should only return valid tasks with priority
      expect(sortedTasks).toHaveLength(2)
      expect(sortedTasks[0].priority).toBe("high")
      expect(sortedTasks[1].priority).toBe("low")
    })

    test("should handle getPriorityStats with null/undefined tasks", () => {
      taskManager.tasks = [
        null,
        undefined,
        { id: "1", priority: "high" },
        { id: "2" }, // No priority
        { id: "3", priority: "medium" },
        { id: "4", priority: "high" },
      ]

      const stats = taskManager.getPriorityStats()
      expect(stats).toEqual({ high: 2, medium: 1, low: 0 })
    })

    test("should handle very large task lists", () => {
      // Create 200 tasks
      for (let i = 0; i < 200; i++) {
        const priorities = ["high", "medium", "low"]
        const priority = priorities[i % 3]
        taskManager.createTask({
          title: `Task ${i}`,
          priority,
          status: "to-do",
        })
      }

      const startTime = Date.now()
      const sortedTasks = taskManager.getTasksSortedByPriority()
      const endTime = Date.now()

      expect(sortedTasks).toHaveLength(200)
      expect(endTime - startTime).toBeLessThan(100) // Should be fast

      // Verify sorting
      let lastPriorityValue = 0
      const priorityValues = { high: 1, medium: 2, low: 3 }

      sortedTasks.forEach((task) => {
        const currentPriorityValue = priorityValues[task.priority]
        expect(currentPriorityValue).toBeGreaterThanOrEqual(lastPriorityValue)
        lastPriorityValue = currentPriorityValue
      })
    })

    test("should handle priority stats with uneven distribution", () => {
      // Create uneven distribution
      for (let i = 0; i < 10; i++) {
        taskManager.createTask({ title: `High ${i}`, priority: "high", status: "to-do" })
      }
      for (let i = 0; i < 3; i++) {
        taskManager.createTask({ title: `Medium ${i}`, priority: "medium", status: "to-do" })
      }
      for (let i = 0; i < 1; i++) {
        taskManager.createTask({ title: `Low ${i}`, priority: "low", status: "to-do" })
      }

      const stats = taskManager.getPriorityStats()
      expect(stats).toEqual({ high: 10, medium: 3, low: 1 })

      const sortedTasks = taskManager.getTasksSortedByPriority()
      expect(sortedTasks).toHaveLength(14)

      // First 10 should be high priority
      for (let i = 0; i < 10; i++) {
        expect(sortedTasks[i].priority).toBe("high")
      }

      // Next 3 should be medium priority
      for (let i = 10; i < 13; i++) {
        expect(sortedTasks[i].priority).toBe("medium")
      }

      // Last 1 should be low priority
      expect(sortedTasks[13].priority).toBe("low")
    })

    test("should handle sorting with identical timestamps", () => {
      const fixedTime = new Date().toISOString()

      // Create tasks with same timestamp
      const task1 = taskManager.createTask({ title: "Task 1", priority: "medium", status: "to-do" })
      const task2 = taskManager.createTask({ title: "Task 2", priority: "medium", status: "to-do" })
      const task3 = taskManager.createTask({ title: "Task 3", priority: "medium", status: "to-do" })

      // Manually set same timestamps
      task1.createdAt = fixedTime
      task2.createdAt = fixedTime
      task3.createdAt = fixedTime

      const sortedTasks = taskManager.getTasksSortedByPriority()

      // Should maintain original order for same priority
      expect(sortedTasks[0].title).toBe("Task 1")
      expect(sortedTasks[1].title).toBe("Task 2")
      expect(sortedTasks[2].title).toBe("Task 3")
    })
  })
})

