// Day 5 Tests - US4: Delete Tasks
// TDD Approach: Write tests first for delete functionality

const { TaskManager } = require("../TaskManager.js");

describe("TaskManager - Day 5: US4 Delete Tasks", () => {
  let taskManager

  beforeEach(() => {
    localStorage.clear()
    taskManager = new TaskManager()
  })

  describe("US4: Delete Task Functionality", () => {
    test("should delete task successfully", () => {
      // Create test tasks
      const task1 = taskManager.createTask({
        title: "Task to Delete",
        description: "This will be deleted",
        priority: "high",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "Task to Keep",
        description: "This will remain",
        priority: "medium",
        status: "in-progress",
      })

      expect(taskManager.getAllTasks()).toHaveLength(2)

      // Delete first task
      const result = taskManager.deleteTask(task1.id)

      expect(result).toBe(true)
      expect(taskManager.getAllTasks()).toHaveLength(1)
      expect(taskManager.getTaskById(task1.id)).toBeNull()
      expect(taskManager.getTaskById(task2.id)).not.toBeNull()
    })

    test("should throw error when deleting non-existent task", () => {
      expect(() => {
        taskManager.deleteTask("non-existent-id")
      }).toThrow("Task not found")
    })

    test("should save to localStorage after deletion", () => {
      const task = taskManager.createTask({
        title: "Task to Delete",
        priority: "medium",
        status: "to-do",
      })

      taskManager.deleteTask(task.id)

      expect(localStorage.setItem).toHaveBeenCalledWith("taskeasy-tasks", expect.not.stringContaining("Task to Delete"))
    })

    test("should handle deleting the only task", () => {
      const task = taskManager.createTask({
        title: "Only Task",
        priority: "high",
        status: "done",
      })

      expect(taskManager.getAllTasks()).toHaveLength(1)

      taskManager.deleteTask(task.id)

      expect(taskManager.getAllTasks()).toHaveLength(0)
      expect(taskManager.getTaskById(task.id)).toBeNull()
    })

    test("should maintain task order after deletion", () => {
      const task1 = taskManager.createTask({
        title: "First Task",
        priority: "high",
        status: "to-do",
      })

      const task2 = taskManager.createTask({
        title: "Second Task",
        priority: "medium",
        status: "to-do",
      })

      const task3 = taskManager.createTask({
        title: "Third Task",
        priority: "low",
        status: "to-do",
      })

      // Delete middle task
      taskManager.deleteTask(task2.id)

      const remainingTasks = taskManager.getTasksSortedByPriority()
      expect(remainingTasks).toHaveLength(2)
      expect(remainingTasks[0].title).toBe("First Task")
      expect(remainingTasks[1].title).toBe("Third Task")
    })

    test("should exit edit mode if editing task is deleted", () => {
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

      // Enter edit mode for task1
      taskManager.enterEditMode(task1.id)
      expect(taskManager.isInEditMode()).toBe(true)
      expect(taskManager.getEditingTaskId()).toBe(task1.id)

      // Delete the task being edited
      taskManager.deleteTask(task1.id)

      expect(taskManager.isInEditMode()).toBe(false)
      expect(taskManager.getEditingTaskId()).toBeNull()
    })

    test("should not affect edit mode if different task is deleted", () => {
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

      // Enter edit mode for task1
      taskManager.enterEditMode(task1.id)
      expect(taskManager.isInEditMode()).toBe(true)

      // Delete different task
      taskManager.deleteTask(task2.id)

      expect(taskManager.isInEditMode()).toBe(true)
      expect(taskManager.getEditingTaskId()).toBe(task1.id)
    })
  })

  describe("Delete Confirmation System", () => {
    test("should track task pending deletion", () => {
      const task = taskManager.createTask({
        title: "Task to Delete",
        priority: "high",
        status: "to-do",
      })

      taskManager.requestDelete(task.id)

      expect(taskManager.getPendingDeleteId()).toBe(task.id)
      expect(taskManager.isDeletePending()).toBe(true)
      expect(taskManager.isPendingDelete(task.id)).toBe(true)
    })

    test("should confirm and execute deletion", () => {
      const task = taskManager.createTask({
        title: "Task to Delete",
        priority: "high",
        status: "to-do",
      })

      taskManager.requestDelete(task.id)
      expect(taskManager.getAllTasks()).toHaveLength(1)

      const result = taskManager.confirmDelete()

      expect(result).toBe(true)
      expect(taskManager.getAllTasks()).toHaveLength(0)
      expect(taskManager.isDeletePending()).toBe(false)
      expect(taskManager.getPendingDeleteId()).toBeNull()
    })

    test("should cancel deletion request", () => {
      const task = taskManager.createTask({
        title: "Task to Keep",
        priority: "medium",
        status: "to-do",
      })

      taskManager.requestDelete(task.id)
      expect(taskManager.isDeletePending()).toBe(true)

      taskManager.cancelDelete()

      expect(taskManager.isDeletePending()).toBe(false)
      expect(taskManager.getPendingDeleteId()).toBeNull()
      expect(taskManager.getAllTasks()).toHaveLength(1)
      expect(taskManager.getTaskById(task.id)).not.toBeNull()
    })

    test("should throw error when confirming without pending delete", () => {
      expect(() => {
        taskManager.confirmDelete()
      }).toThrow("No delete operation pending")
    })

    test("should handle multiple delete requests", () => {
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

      // Request delete for task1
      taskManager.requestDelete(task1.id)
      expect(taskManager.getPendingDeleteId()).toBe(task1.id)

      // Request delete for task2 (should replace previous request)
      taskManager.requestDelete(task2.id)
      expect(taskManager.getPendingDeleteId()).toBe(task2.id)
      expect(taskManager.isPendingDelete(task1.id)).toBe(false)
      expect(taskManager.isPendingDelete(task2.id)).toBe(true)
    })
  })

  describe("Bulk Operations", () => {
    test("should delete multiple tasks by IDs", () => {
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

      const task3 = taskManager.createTask({
        title: "Task 3",
        priority: "low",
        status: "done",
      })

      const deletedCount = taskManager.deleteTasks([task1.id, task3.id])

      expect(deletedCount).toBe(2)
      expect(taskManager.getAllTasks()).toHaveLength(1)
      expect(taskManager.getTaskById(task2.id)).not.toBeNull()
      expect(taskManager.getTaskById(task1.id)).toBeNull()
      expect(taskManager.getTaskById(task3.id)).toBeNull()
    })

    test("should delete completed tasks", () => {
      taskManager.createTask({
        title: "Todo Task",
        priority: "high",
        status: "to-do",
      })

      taskManager.createTask({
        title: "In Progress Task",
        priority: "medium",
        status: "in-progress",
      })

      taskManager.createTask({
        title: "Done Task 1",
        priority: "low",
        status: "done",
      })

      taskManager.createTask({
        title: "Done Task 2",
        priority: "high",
        status: "done",
      })

      const deletedCount = taskManager.deleteCompletedTasks()

      expect(deletedCount).toBe(2)
      expect(taskManager.getAllTasks()).toHaveLength(2)
      expect(taskManager.getAllTasks().every((task) => task.status !== "done")).toBe(true)
    })

    test("should delete all tasks", () => {
      taskManager.createTask({
        title: "Task 1",
        priority: "high",
        status: "to-do",
      })

      taskManager.createTask({
        title: "Task 2",
        priority: "medium",
        status: "done",
      })

      const deletedCount = taskManager.deleteAllTasks()

      expect(deletedCount).toBe(2)
      expect(taskManager.getAllTasks()).toHaveLength(0)
    })
  })

  describe("Statistics Update After Deletion", () => {
    test("should update priority statistics after deletion", () => {
      taskManager.createTask({
        title: "High Priority Task",
        priority: "high",
        status: "to-do",
      })

      const mediumTask = taskManager.createTask({
        title: "Medium Priority Task",
        priority: "medium",
        status: "to-do",
      })

      taskManager.createTask({
        title: "Low Priority Task",
        priority: "low",
        status: "to-do",
      })

      let stats = taskManager.getPriorityStats()
      expect(stats.high).toBe(1)
      expect(stats.medium).toBe(1)
      expect(stats.low).toBe(1)

      taskManager.deleteTask(mediumTask.id)

      stats = taskManager.getPriorityStats()
      expect(stats.high).toBe(1)
      expect(stats.medium).toBe(0)
      expect(stats.low).toBe(1)
      expect(stats.total).toBe(2)
    })

    test("should update status statistics after deletion", () => {
      taskManager.createTask({
        title: "Todo Task",
        priority: "high",
        status: "to-do",
      })

      const doneTask = taskManager.createTask({
        title: "Done Task",
        priority: "medium",
        status: "done",
      })

      let stats = taskManager.getStats()
      expect(stats.total).toBe(2)
      expect(stats.completed).toBe(1)
      expect(stats.todo).toBe(1)

      taskManager.deleteTask(doneTask.id)

      stats = taskManager.getStats()
      expect(stats.total).toBe(1)
      expect(stats.completed).toBe(0)
      expect(stats.todo).toBe(1)
    })
  })

  describe("Error Handling and Edge Cases", () => {
    test("should handle localStorage errors during deletion", () => {
      const task = taskManager.createTask({
        title: "Test Task",
        priority: "medium",
        status: "to-do",
      })

      // Mock localStorage to throw error
      localStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded")
      })

      expect(() => {
        taskManager.deleteTask(task.id)
      }).not.toThrow()

      expect(console.error).toHaveBeenCalled()
    })

    test("should handle deleting task with invalid ID format", () => {
      expect(() => {
        taskManager.deleteTask("")
      }).toThrow("Task not found")

      expect(() => {
        taskManager.deleteTask(null)
      }).toThrow("Task not found")

      expect(() => {
        taskManager.deleteTask(undefined)
      }).toThrow("Task not found")
    })

    test("should handle empty task list deletion operations", () => {
      expect(taskManager.deleteCompletedTasks()).toBe(0)
      expect(taskManager.deleteAllTasks()).toBe(0)
      expect(taskManager.deleteTasks([])).toBe(0)
    })
  })
})
