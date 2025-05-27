// TaskEasy - Day 4: US1 Create + US2 Priority Sorting + US3 Update Tasks
// Following XP principles: Only implement what's needed for current user story

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks()
    this.currentEditId = null

    // Only initialize DOM-related stuff if we're in a browser environment
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      this.initializeEventListeners()
      this.renderTasks()
      this.updateStats()
    }

    console.log("🚀 TaskEasy Day 4: US3 Update Tasks")
    console.log("Pair Programming: Rian (Driver), Robi (Navigator), Zein (Reviewer)")
    console.log("Features: CREATE + PRIORITY SORTING + UPDATE TASKS")
  }

  // Load tasks from localStorage
  loadTasks() {
    try {
      if (typeof localStorage === "undefined") return []
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
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("taskeasy-tasks", JSON.stringify(this.tasks))
      }
    } catch (error) {
      console.error("Error saving tasks:", error)
    }
  }

  // Generate unique ID for tasks
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // US1: Validate task data
  validateTask(taskData) {
    const errors = []

    // Convert title to string for validation
    const title = taskData.title !== undefined && taskData.title !== null ? String(taskData.title) : ""
    if (!title || title.trim() === "") {
      errors.push("Title is required")
    }

    if (title && title.length > 100) {
      errors.push("Title must be less than 100 characters")
    }

    if (!["high", "medium", "low"].includes(taskData.priority)) {
      errors.push("Invalid priority value")
    }

    if (!["to-do", "in-progress", "done"].includes(taskData.status)) {
      errors.push("Invalid status value")
    }

    return errors
  }

  // US1: Create task with title, description, priority
  createTask(taskData) {
    const errors = this.validateTask(taskData)
    if (errors.length > 0) {
      throw new Error(errors[0])
    }

    const task = {
      id: this.generateId(),
      title: taskData.title !== undefined && taskData.title !== null ? String(taskData.title).trim() : "",
      description:
        taskData.description !== undefined && taskData.description !== null ? String(taskData.description).trim() : "",
      priority: taskData.priority,
      status: taskData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.tasks.push(task)
    this.saveTasks()
    return task
  }

  // US3: Update task functionality
  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    const currentTask = this.tasks[taskIndex]
    const updatedData = { ...currentTask, ...updates }

    // Trim string fields if they are being updated
    if (updates.title !== undefined) {
      updatedData.title = updates.title !== null ? String(updates.title).trim() : ""
    }
    if (updates.description !== undefined) {
      updatedData.description = updates.description !== null ? String(updates.description).trim() : ""
    }

    const errors = this.validateTask(updatedData)
    if (errors.length > 0) {
      throw new Error(errors[0])
    }

    this.tasks[taskIndex] = {
      ...currentTask,
      ...updates,
      title: updatedData.title !== null ? String(updatedData.title).trim() : "",
      description: updatedData.description,
      updatedAt: new Date().toISOString(),
    }

    this.saveTasks()
    return this.tasks[taskIndex]
  }

  // US2: Sort tasks by priority (high > medium > low)
  getTasksSortedByPriority() {
    const priorityOrder = { high: 1, medium: 2, low: 3 }

    return [...this.tasks]
      .filter((task) => task && task.priority) // Filter out null/undefined tasks
      .sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
  }

  // US2: Get priority stats
  getPriorityStats() {
    return this.tasks.reduce(
      (stats, task) => {
        if (task && task.priority) {
          stats[task.priority]++
        }
        return stats
      },
      { high: 0, medium: 0, low: 0 },
    )
  }

  // Edit mode management
  enterEditMode(taskId) {
    this.exitEditMode() // Exit any current edit mode
    this.currentEditId = taskId
    this.populateEditForm(taskId)
    if (typeof document !== "undefined") {
      this.renderTasks() // Re-render to show edit state
    }
  }

  exitEditMode() {
    this.currentEditId = null
    this.resetForm()
    if (typeof document !== "undefined") {
      this.renderTasks() // Re-render to hide edit state
    }
  }

  isInEditMode() {
    return this.currentEditId !== null
  }

  getEditingTaskId() {
    return this.currentEditId
  }

  populateEditForm(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (!task || typeof document === "undefined") return

    // Safely get DOM elements with null checks
    const titleEl = document.getElementById("taskTitle")
    const descEl = document.getElementById("taskDescription")
    const priorityEl = document.getElementById("taskPriority")
    const statusEl = document.getElementById("taskStatus")
    const formTitleEl = document.getElementById("formTitle")
    const submitBtnEl = document.getElementById("submitBtn")
    const cancelBtnEl = document.getElementById("cancelBtn")

    // Populate form fields if elements exist
    if (titleEl) titleEl.value = task.title
    if (descEl) descEl.value = task.description || ""
    if (priorityEl) priorityEl.value = task.priority
    if (statusEl) statusEl.value = task.status

    // Update form UI for edit mode if elements exist
    if (formTitleEl) formTitleEl.textContent = "Edit Task"
    if (submitBtnEl) submitBtnEl.textContent = "Update Task"
    if (cancelBtnEl) cancelBtnEl.style.display = "inline-block"
  }

  // Handle edit button click
  handleEditClick(taskId) {
    this.enterEditMode(taskId)
  }

  // Handle save edit
  handleSaveEdit() {
    if (!this.currentEditId || typeof document === "undefined") return

    try {
      const titleEl = document.getElementById("taskTitle")
      const descEl = document.getElementById("taskDescription")
      const priorityEl = document.getElementById("taskPriority")
      const statusEl = document.getElementById("taskStatus")

      const title = titleEl ? titleEl.value.trim() : ""
      const description = descEl ? descEl.value.trim() : ""
      const priority = priorityEl ? priorityEl.value : "medium"
      const status = statusEl ? statusEl.value : "to-do"

      const updates = { title, description, priority, status }
      this.updateTask(this.currentEditId, updates)

      this.showNotification("Task updated successfully!", "success")
      this.exitEditMode()
      this.updateStats()
    } catch (error) {
      this.showNotification(error.message, "error")
    }
  }

  // Handle cancel edit
  handleCancelEdit() {
    this.exitEditMode()
    this.showNotification("Edit cancelled", "info")
  }

  // Initialize event listeners
  initializeEventListeners() {
    if (typeof document === "undefined") return

    const form = document.getElementById("taskForm")
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFormSubmit()
      })
    }

    // Cancel button for edit mode
    const cancelBtn = document.getElementById("cancelBtn")
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.handleCancelEdit()
      })
    }
  }

  // Handle form submission - US1 create or US3 update
  handleFormSubmit() {
    if (typeof document === "undefined") return

    const submitBtn = document.querySelector("#submitBtn")
    if (!submitBtn) return

    const originalText = submitBtn.textContent

    try {
      submitBtn.textContent = this.isInEditMode() ? "Updating..." : "Creating..."
      submitBtn.disabled = true

      const titleEl = document.getElementById("taskTitle")
      const descEl = document.getElementById("taskDescription")
      const priorityEl = document.getElementById("taskPriority")
      const statusEl = document.getElementById("taskStatus")

      if (!titleEl || !priorityEl || !statusEl) return

      const title = titleEl.value.trim()
      const description = descEl ? descEl.value.trim() : ""
      const priority = priorityEl.value
      const status = statusEl.value

      if (this.isInEditMode()) {
        // Update existing task
        this.handleSaveEdit()
      } else {
        // Create new task
        const taskData = { title, description, priority, status }
        const task = this.createTask(taskData)
        this.showNotification(`Task "${task.title}" created successfully!`, "success")
      }

      this.resetForm()
      this.renderTasks()
      this.updateStats()
    } catch (error) {
      this.showNotification(error.message, "error")
    } finally {
      setTimeout(() => {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 500)
    }
  }

  // Reset form to default state
  resetForm() {
    if (typeof document === "undefined") return

    const form = document.getElementById("taskForm")
    const priorityEl = document.getElementById("taskPriority")
    const statusEl = document.getElementById("taskStatus")
    const titleEl = document.getElementById("taskTitle")
    const formTitleEl = document.getElementById("formTitle")
    const submitBtnEl = document.getElementById("submitBtn")
    const cancelBtnEl = document.getElementById("cancelBtn")

    // Reset form if it exists
    if (form) form.reset()
    if (priorityEl) priorityEl.value = "medium"
    if (statusEl) statusEl.value = "to-do"
    if (titleEl) titleEl.focus()

    // Reset form UI if elements exist
    if (formTitleEl) formTitleEl.textContent = "Create New Task"
    if (submitBtnEl) submitBtnEl.textContent = "Create Task"
    if (cancelBtnEl) cancelBtnEl.style.display = "none"
  }

  // Render tasks - US2: Show tasks sorted by priority
  renderTasks() {
    if (typeof document === "undefined") return

    const taskList = document.getElementById("taskList")
    if (!taskList) return

    if (this.tasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No tasks yet. Create your first task above!</p>
          <small>Tasks will be automatically sorted by priority: High → Medium → Low</small>
        </div>
      `
      return
    }

    // US2: Show tasks sorted by priority
    const sortedTasks = this.getTasksSortedByPriority()
    taskList.innerHTML = sortedTasks.map((task) => this.createTaskHTML(task)).join("")
  }

  // Create HTML for a single task
  createTaskHTML(task) {
    const priorityText = { high: "High", medium: "Medium", low: "Low" }
    const statusText = { "to-do": "To Do", "in-progress": "In Progress", done: "Done" }
    const isEditing = this.currentEditId === task.id

    return `
      <div class="task-item priority-${task.priority} ${isEditing ? "editing" : ""}" data-task-id="${task.id}">
        ${isEditing ? '<div class="editing-indicator">Editing</div>' : ""}
        
        <div class="task-header">
          <div class="task-title">${this.escapeHtml(task.title)}</div>
        </div>
        
        <div class="task-meta">
          <span class="task-badge priority-${task.priority}">${priorityText[task.priority]}</span>
          <span class="task-badge status-${task.status}">${statusText[task.status]}</span>
        </div>
        
        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ""}
        
        <div class="task-dates">
          Created: ${this.formatDate(task.createdAt)}
          ${task.updatedAt !== task.createdAt ? `• Updated: ${this.formatDate(task.updatedAt)}` : ""}
        </div>

        <div class="task-actions">
          <button class="edit-btn" onclick="taskManager.handleEditClick('${task.id}')">
            ✏️ Edit
          </button>
        </div>
      </div>
    `
  }

  // Update statistics - US2: Add priority breakdown
  updateStats() {
    if (typeof document === "undefined") return

    const statsEl = document.getElementById("taskStats")
    if (!statsEl) return

    const total = this.tasks.length
    const completed = this.tasks.filter((task) => task.status === "done").length
    const inProgress = this.tasks.filter((task) => task.status === "in-progress").length
    const todo = this.tasks.filter((task) => task.status === "to-do").length

    // US2: Add priority breakdown
    const priorityStats = this.getPriorityStats()

    let statsText = `${total} task${total !== 1 ? "s" : ""} created`
    if (total > 0) {
      statsText += ` • ${completed} done • ${inProgress} active • ${todo} todo`
      statsText += ` • Priority: ${priorityStats.high}H/${priorityStats.medium}M/${priorityStats.low}L`
    }

    statsEl.textContent = statsText
  }

  // Show notification
  showNotification(message, type = "info") {
    if (typeof document === "undefined") return

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 3000)
  }

  // Utility functions
  escapeHtml(text) {
    if (typeof document === "undefined" || typeof document.createElement !== "function") {
      // Fallback for Node.js environment or incomplete document mock
      return String(text)
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
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Methods that will be implemented in future days
  // US4 - Day 5: deleteTask()
}

// Export for both CommonJS and ES modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = TaskManager
} else if (typeof window !== "undefined") {
  window.TaskManager = TaskManager
}

