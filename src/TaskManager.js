// TaskEasy - TaskManager Class - Day 2: US1 Implementation
// Following TDD approach: Tests written first, now implementing

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks()
    this.currentEditId = null
    this.pendingDeleteId = null

    // Only initialize DOM listeners if we're in a browser environment
    if (typeof document !== "undefined") {
      this.initializeEventListeners()
      this.renderTasks()
      this.updateStats()
    }
  }

  // Load tasks from localStorage
  loadTasks() {
    try {
      const tasks = localStorage.getItem("taskeasy-tasks")
      return tasks ? JSON.parse(tasks) : []
    } catch (error) {
      console.error("Error loading tasks:", error)
      return []
    }
  }

  // Save tasks to localStorage
  saveTasks() {
    try {
      localStorage.setItem("taskeasy-tasks", JSON.stringify(this.tasks))
      return true
    } catch (error) {
      console.error("Error saving tasks:", error)
      return false
    }
  }

  // Generate unique ID for tasks
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Validate task data - US1 Requirements
  validateTask(taskData) {
    const errors = []

    // Title validation
    if (!taskData.title || taskData.title.trim() === "") {
      errors.push("Title is required")
    }

    if (taskData.title && taskData.title.length > 100) {
      errors.push("Title too long")
    }

    // Priority validation
    if (!["high", "medium", "low"].includes(taskData.priority)) {
      errors.push("Invalid priority")
    }

    // Status validation
    if (!["to-do", "in-progress", "done"].includes(taskData.status)) {
      errors.push("Invalid status")
    }

    return errors
  }

  // US1: Create task with title, description, priority
  createTask(taskData) {
    const errors = this.validateTask(taskData)
    if (errors.length > 0) {
      throw new Error(errors[0]) // Throw first error for simplicity
    }

    const task = {
      id: this.generateId(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || "",
      priority: taskData.priority,
      status: taskData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.tasks.push(task)
    this.saveTasks()
    return task
  }

  // Get all tasks
  getAllTasks() {
    return [...this.tasks]
  }

  // US2: Get tasks sorted by priority (high -> medium -> low)
  getTasksSortedByPriority() {
    return [...this.tasks].sort((a, b) => {
      const priorityA = this.getPriorityOrder(a.priority)
      const priorityB = this.getPriorityOrder(b.priority)

      // Primary sort: by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // Secondary sort: by creation date (maintain creation order within same priority)
      return new Date(a.createdAt) - new Date(b.createdAt)
    })
  }

  // Get tasks by specific priority
  getTasksByPriority(priority) {
    if (!this.isValidPriority(priority)) {
      return []
    }
    return this.tasks.filter((task) => task.priority === priority)
  }

  // Get priority statistics
  getPriorityStats() {
    const stats = {
      high: 0,
      medium: 0,
      low: 0,
      total: this.tasks.length,
    }

    this.tasks.forEach((task) => {
      if (stats.hasOwnProperty(task.priority)) {
        stats[task.priority]++
      }
    })

    return stats
  }

  // Refactoring: Helper functions for priority management
  isValidPriority(priority) {
    return ["high", "medium", "low"].includes(priority)
  }

  getPriorityOrder(priority) {
    const order = { high: 1, medium: 2, low: 3 }
    return order[priority] || 999
  }

  formatPriorityText(priority) {
    const formats = {
      high: "🔴 High Priority",
      medium: "🟡 Medium Priority",
      low: "🟢 Low Priority",
    }
    return formats[priority] || priority
  }

  // Get task by ID
  getTaskById(id) {
    return this.tasks.find((task) => task.id === id) || null
  }

  // Get task statistics
  getStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((task) => task.status === "done").length
    const inProgress = this.tasks.filter((task) => task.status === "in-progress").length
    const todo = this.tasks.filter((task) => task.status === "to-do").length

    return { total, completed, inProgress, todo }
  }

  // Initialize event listeners (DOM-dependent)
  initializeEventListeners() {
    const taskForm = document.getElementById("taskForm")
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFormSubmit()
      })
    }
  }

  // Handle form submission (DOM-dependent)
  handleFormSubmit() {
    const title = document.getElementById("taskTitle")?.value?.trim() || ""
    const description = document.getElementById("taskDescription")?.value?.trim() || ""
    const priority = document.getElementById("taskPriority")?.value || "medium"
    const status = document.getElementById("taskStatus")?.value || "to-do"

    try {
      const taskData = { title, description, priority, status }
      const task = this.createTask(taskData)

      this.showNotification("Task created successfully!", "success")
      this.resetForm()
      this.renderTasks()
      this.updateStats()

      return task
    } catch (error) {
      this.showNotification(error.message, "error")
      throw error
    }
  }

  // DOM manipulation methods
  resetForm() {
    const form = document.getElementById("taskForm")
    if (form) form.reset()

    const priority = document.getElementById("taskPriority")
    if (priority) priority.value = "medium"

    const status = document.getElementById("taskStatus")
    if (status) status.value = "to-do"
  }

  renderTasks() {
    const taskList = document.getElementById("taskList")
    if (!taskList) return

    if (this.tasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Create your first task using the form above</p>
        </div>
      `
      return
    }

    // US2: Render tasks sorted by priority
    const sortedTasks = this.getTasksSortedByPriority()
    taskList.innerHTML = sortedTasks.map((task) => this.createTaskHTML(task)).join("")
  }

  createTaskHTML(task) {
    const priorityText = { high: "High", medium: "Medium", low: "Low" }
    const statusText = { "to-do": "To Do", "in-progress": "In Progress", done: "Done" }

    return `
      <div class="task-item priority-${task.priority}" data-task-id="${task.id}">
        <div class="task-header">
          <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
        </div>
        <div class="task-meta">
          <span class="task-badge priority-${task.priority}">${priorityText[task.priority]}</span>
          <span class="task-badge status-${task.status}">${statusText[task.status]}</span>
        </div>
        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ""}
        <div class="task-dates">
          Created: ${this.formatDate(task.createdAt)}
        </div>
      </div>
    `
  }

  updateStats() {
    const statsElement = document.getElementById("taskStats")
    if (!statsElement) return

    const stats = this.getStats()
    const priorityStats = this.getPriorityStats()

    let statsText = `${stats.total} task${stats.total !== 1 ? "s" : ""}`

    if (stats.total > 0) {
      statsText += ` • ${stats.completed} done • ${stats.inProgress} in progress • ${stats.todo} to do`
      statsText += ` • Priority: ${priorityStats.high}H/${priorityStats.medium}M/${priorityStats.low}L`
    }

    statsElement.textContent = statsText
  }

  showNotification(message, type = "info") {
    if (typeof document === "undefined") return

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#10b981" : "#ef4444"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1001;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Utility functions
  escapeHtml(text) {
    if (typeof document === "undefined") {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    }

    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // US3: Update task functionality
  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    // Validate updates
    const currentTask = this.tasks[taskIndex]
    const updatedData = { ...currentTask, ...updates }

    // Trim string fields
    if (updates.title !== undefined) {
      updatedData.title = updates.title.trim()
    }
    if (updates.description !== undefined) {
      updatedData.description = updates.description.trim()
    }

    const errors = this.validateTask(updatedData)
    if (errors.length > 0) {
      throw new Error(errors[0])
    }

    // Update the task
    this.tasks[taskIndex] = {
      ...currentTask,
      ...updates,
      title: updatedData.title,
      description: updatedData.description,
      updatedAt: new Date().toISOString(),
    }

    this.saveTasks()
    return this.tasks[taskIndex]
  }

  // US4: Delete task functionality
  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    // Exit edit mode if deleting the task being edited
    if (this.currentEditId === taskId) {
      this.exitEditMode()
    }

    // Remove task from array
    this.tasks.splice(taskIndex, 1)
    this.saveTasks()
    return true
  }

  // Delete confirmation system
  requestDelete(taskId) {
    const task = this.getTaskById(taskId)
    if (!task) {
      throw new Error("Task not found")
    }
    this.pendingDeleteId = taskId
  }

  confirmDelete() {
    if (!this.pendingDeleteId) {
      throw new Error("No delete operation pending")
    }

    const result = this.deleteTask(this.pendingDeleteId)
    this.pendingDeleteId = null
    return result
  }

  cancelDelete() {
    this.pendingDeleteId = null
  }

  isDeletePending() {
    return this.pendingDeleteId !== null
  }

  getPendingDeleteId() {
    return this.pendingDeleteId
  }

  isPendingDelete(taskId) {
    return this.pendingDeleteId === taskId
  }

  // Bulk delete operations
  deleteTasks(taskIds) {
    let deletedCount = 0

    // Sort IDs by index (descending) to avoid index shifting issues
    const tasksToDelete = taskIds
      .map((id) => ({ id, index: this.tasks.findIndex((task) => task.id === id) }))
      .filter((item) => item.index !== -1)
      .sort((a, b) => b.index - a.index)

    tasksToDelete.forEach(({ id, index }) => {
      // Exit edit mode if deleting the task being edited
      if (this.currentEditId === id) {
        this.exitEditMode()
      }

      this.tasks.splice(index, 1)
      deletedCount++
    })

    if (deletedCount > 0) {
      this.saveTasks()
    }

    return deletedCount
  }

  deleteCompletedTasks() {
    const completedTaskIds = this.tasks.filter((task) => task.status === "done").map((task) => task.id)

    return this.deleteTasks(completedTaskIds)
  }

  deleteAllTasks() {
    const allTaskIds = this.tasks.map((task) => task.id)
    return this.deleteTasks(allTaskIds)
  }

  // Edit mode management
  enterEditMode(taskId) {
    const task = this.getTaskById(taskId)
    if (!task) {
      throw new Error("Task not found")
    }
    this.currentEditId = taskId
  }

  exitEditMode() {
    this.currentEditId = null
  }

  isInEditMode() {
    return this.currentEditId !== null
  }

  getEditingTaskId() {
    return this.currentEditId
  }

  getEditingTask() {
    if (!this.currentEditId) {
      return null
    }
    return this.getTaskById(this.currentEditId)
  }
}

module.exports = { TaskManager };
