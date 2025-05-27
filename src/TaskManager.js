// TaskEasy - Day 2: US1 Create Task ONLY
// Following XP principles: Only implement what's needed for current user story

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks()
    
    // Only initialize DOM-related stuff if we're in a browser environment
    if (typeof document !== 'undefined') {
      this.initializeEventListeners()
      this.renderTasks()
      this.updateStats()
    }

    console.log("🚀 TaskEasy Day 2: US1 Create Task")
    console.log("Pair Programming: Zein (Driver), Rian (Navigator), Robi (Reviewer)")
    console.log("Features: CREATE ONLY - No edit/delete until Day 4")
  }

  // Load tasks from localStorage
  loadTasks() {
    try {
      if (typeof localStorage === 'undefined') return []
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
      if (typeof localStorage !== 'undefined') {
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

    if (!taskData.title || taskData.title.trim() === "") {
      errors.push("Title is required")
    }

    if (taskData.title && taskData.title.length > 100) {
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

  // Initialize event listeners
  initializeEventListeners() {
    const form = document.getElementById("taskForm")
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFormSubmit()
      })
    }
  }

  // Handle form submission - US1 only
  handleFormSubmit() {
    const submitBtn = document.querySelector(".add-btn")
    if (!submitBtn) return
    
    const originalText = submitBtn.textContent

    try {
      // Show loading state
      submitBtn.textContent = "Creating..."
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

      const taskData = { title, description, priority, status }
      const task = this.createTask(taskData)

      this.resetForm()
      this.renderTasks()
      this.updateStats()
      this.showNotification(`Task "${task.title}" created successfully!`, "success")
    } catch (error) {
      this.showNotification(error.message, "error")
    } finally {
      // Reset button state
      setTimeout(() => {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 500)
    }
  }

  // Reset form to default state
  resetForm() {
    const form = document.getElementById("taskForm")
    const priorityEl = document.getElementById("taskPriority")
    const statusEl = document.getElementById("taskStatus")
    const titleEl = document.getElementById("taskTitle")

    if (form) form.reset()
    if (priorityEl) priorityEl.value = "medium"
    if (statusEl) statusEl.value = "to-do"
    if (titleEl) titleEl.focus()
  }

  // Render tasks - READ ONLY for Day 2
  renderTasks() {
    const taskList = document.getElementById("taskList")
    if (!taskList) return

    if (this.tasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No tasks yet. Create your first task above!</p>
          <small>Only CREATE functionality available in Day 2</small>
        </div>
      `
      return
    }

    // Show tasks in creation order (no sorting until US2 - Day 3)
    taskList.innerHTML = this.tasks.map((task) => this.createTaskHTML(task)).join("")
  }

  // Create HTML for a single task - READ ONLY
  createTaskHTML(task) {
    const priorityText = { high: "High", medium: "Medium", low: "Low" }
    const statusText = { "to-do": "To Do", "in-progress": "In Progress", done: "Done" }

    return `
      <div class="task-item priority-${task.priority}" data-task-id="${task.id}">
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
        </div>
      </div>
    `
  }

  // Update statistics
  updateStats() {
    const statsEl = document.getElementById("taskStats")
    if (!statsEl) return

    const total = this.tasks.length
    const completed = this.tasks.filter((task) => task.status === "done").length
    const inProgress = this.tasks.filter((task) => task.status === "in-progress").length
    const todo = this.tasks.filter((task) => task.status === "to-do").length

    let statsText = `${total} task${total !== 1 ? "s" : ""} created`
    if (total > 0) {
      statsText += ` • ${completed} done • ${inProgress} active • ${todo} todo`
    }

    statsEl.textContent = statsText
  }

  // Show notification
  showNotification(message, type = "info") {
    if (typeof document === 'undefined') return

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
    if (typeof document === 'undefined') {
      // Fallback for Node.js environment
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
  // US2 - Day 3: sortTasksByPriority()
  // US3 - Day 4: updateTask(), editTask()
  // US4 - Day 4: deleteTask()
}

module.exports = TaskManager;
