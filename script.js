// TaskEasy v2.0 - Modern UI/UX with Complete CRUD
// Day 6: Modern Design Revolution

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks()
    this.currentEditId = null
    this.pendingDeleteId = null
    this.currentFilter = "all"

    // Initialize theme
    this.initializeTheme()

    // Initialize after DOM ready
    this.initializeEventListeners()
    this.renderTasks()
    this.updateStats()

    console.log("🎨 TaskEasy v2.0: Modern UI/UX Revolution!")
    console.log("Day 6 Team: Robi (Driver), Zein (Navigator), Rian (Reviewer)")
    console.log("Features: Modern Design + Dark Mode + Enhanced UX")
  }

  // Theme Management
  initializeTheme() {
    const savedTheme = localStorage.getItem("taskeasy-theme") || "light"
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = savedTheme === "system" ? (systemPrefersDark ? "dark" : "light") : savedTheme

    this.setTheme(theme)

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (localStorage.getItem("taskeasy-theme") === "system") {
        this.setTheme(e.matches ? "dark" : "light")
      }
    })
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.innerHTML = `<span class="theme-icon">${theme === "dark" ? "☀️" : "🌙"}</span>`
    }
    localStorage.setItem("taskeasy-theme", theme)
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)

    // Add a nice transition effect
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
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

  // Validate task data
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

  // Create task with title, description, priority
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
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.setupEventListeners()
      })
    } else {
      this.setupEventListeners()
    }
  }

  setupEventListeners() {
    // Form submission
    const form = document.getElementById("taskForm")
    if (form) {
      form.removeEventListener("submit", this.handleFormSubmitBound)
      this.handleFormSubmitBound = this.handleFormSubmit.bind(this)
      form.addEventListener("submit", this.handleFormSubmitBound)
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancelBtn")
    if (cancelBtn) {
      cancelBtn.removeEventListener("click", this.handleCancelEditBound)
      this.handleCancelEditBound = this.handleCancelEdit.bind(this)
      cancelBtn.addEventListener("click", this.handleCancelEditBound)
    }

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn")
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter
        this.setFilter(filter)
      })
    })

    console.log("✅ Event listeners attached successfully")
  }

  // Handle form submission
  handleFormSubmit(e) {
    e.preventDefault()
    console.log("📝 Form submitted!")

    const submitBtn = document.querySelector("#submitBtn")
    const originalText = submitBtn.innerHTML

    try {
      // Add loading state
      submitBtn.classList.add("loading")
      submitBtn.disabled = true

      const title = document.getElementById("taskTitle").value.trim()
      const description = document.getElementById("taskDescription").value.trim()
      const priority = document.getElementById("taskPriority").value
      const status = document.getElementById("taskStatus").value

      if (this.isInEditMode()) {
        this.handleSaveEdit()
      } else {
        const taskData = { title, description, priority, status }
        const task = this.createTask(taskData)
        console.log("✅ Task created:", task)

        // Show success animation
        this.showSuccessAnimation()
        this.showNotification(`Task "${task.title}" created successfully!`, "success")
      }

      this.resetForm()
      this.renderTasks()
      this.updateStats()
    } catch (error) {
      console.error("❌ Error:", error)
      this.showNotification(error.message, "error")
    } finally {
      setTimeout(() => {
        submitBtn.classList.remove("loading")
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
      }, 500)
    }
  }

  // Show success animation
  showSuccessAnimation() {
    const overlay = document.getElementById("successOverlay")
    if (overlay) {
      overlay.classList.add("show")
      setTimeout(() => {
        overlay.classList.remove("show")
      }, 2000)
    }
  }

  // Focus on create form
  focusCreateForm() {
    const titleInput = document.getElementById("taskTitle")
    if (titleInput) {
      titleInput.focus()
      titleInput.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  // Show completed tasks
  showCompletedTasks() {
    this.setFilter("done")
    const taskList = document.getElementById("taskList")
    if (taskList) {
      taskList.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Show stats
  showStats() {
    const stats = this.getDetailedStats()
    const message =
      `📊 Task Statistics:\n\n` +
      `Total: ${stats.total}\n` +
      `Completed: ${stats.completed}\n` +
      `In Progress: ${stats.inProgress}\n` +
      `To Do: ${stats.todo}\n\n` +
      `Priority Breakdown:\n` +
      `High: ${stats.priority.high}\n` +
      `Medium: ${stats.priority.medium}\n` +
      `Low: ${stats.priority.low}`

    alert(message)
  }

  // Set filter
  setFilter(filter) {
    this.currentFilter = filter

    // Update filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn")
    filterBtns.forEach((btn) => {
      btn.classList.remove("active")
      if (btn.dataset.filter === filter) {
        btn.classList.add("active")
      }
    })

    this.renderTasks()
  }

  // Reset form to default state
  resetForm() {
    const form = document.getElementById("taskForm")
    if (form) {
      form.reset()
    }

    const priority = document.getElementById("taskPriority")
    const status = document.getElementById("taskStatus")

    if (priority) priority.value = "medium"
    if (status) status.value = "to-do"

    // Reset form UI
    const formTitle = document.getElementById("formTitle")
    const submitBtn = document.getElementById("submitBtn")
    const cancelBtn = document.getElementById("cancelBtn")

    if (formTitle) {
      formTitle.innerHTML = '<span class="card-icon">📝</span>Create New Task'
    }
    if (submitBtn) {
      submitBtn.innerHTML =
        '<span class="btn-icon">➕</span><span class="btn-text">Create Task</span><div class="btn-loader"></div>'
    }
    if (cancelBtn) {
      cancelBtn.style.display = "none"
    }
  }

  // Render tasks with filters
  renderTasks() {
    const taskList = document.getElementById("taskList")
    if (!taskList) return

    const filteredTasks = this.getFilteredTasks()

    if (filteredTasks.length === 0) {
      const emptyMessage =
        this.currentFilter === "all"
          ? "Ready to get productive?"
          : `No ${this.currentFilter === "done" ? "completed" : this.currentFilter + " priority"} tasks found`

      const emptyText =
        this.currentFilter === "all"
          ? "Create your first task to get started with TaskEasy"
          : "Try adjusting your filter or create a new task"

      taskList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${this.currentFilter === "all" ? "🚀" : "🔍"}</div>
          <h3 class="empty-state-title">${emptyMessage}</h3>
          <p class="empty-state-text">${emptyText}</p>
          ${
            this.currentFilter === "all"
              ? `
            <button class="btn btn-primary btn-sm" onclick="taskManager.focusCreateForm()">
              <span class="btn-icon">➕</span>
              <span class="btn-text">Create First Task</span>
            </button>
          `
              : ""
          }
        </div>
      `
      return
    }

    const sortedTasks = this.sortTasksByPriority(filteredTasks)
    const completedCount = this.tasks.filter((task) => task.status === "done").length

    let html = sortedTasks
      .map((task, index) => {
        return this.createTaskHTML(task, index)
      })
      .join("")

    // Add bulk actions if there are completed tasks
    if (completedCount > 0 && this.currentFilter === "all") {
      html += `
        <div class="bulk-actions">
          <button class="btn btn-secondary btn-sm" onclick="taskManager.handleDeleteCompleted()">
            <span class="btn-icon">🗑️</span>
            <span class="btn-text">Delete ${completedCount} Completed Task${completedCount !== 1 ? "s" : ""}</span>
          </button>
        </div>
      `
    }

    taskList.innerHTML = html
  }

  // Get filtered tasks
  getFilteredTasks() {
    if (this.currentFilter === "all") {
      return this.tasks
    }

    if (["high", "medium", "low"].includes(this.currentFilter)) {
      return this.tasks.filter((task) => task.priority === this.currentFilter)
    }

    if (["to-do", "in-progress", "done"].includes(this.currentFilter)) {
      return this.tasks.filter((task) => task.status === this.currentFilter)
    }
    return this.tasks.filter((task) => task.status === this.currentFilter)

    return this.tasks
  }

  // Create HTML for a single task with animation delay
  createTaskHTML(task, index) {
    const priorityText = { high: "High", medium: "Medium", low: "Low" }
    const statusText = { "to-do": "To Do", "in-progress": "In Progress", done: "Done" }
    const isEditing = this.currentEditId === task.id

    return `
      <div class="task-item priority-${task.priority} ${isEditing ? "editing" : ""}" 
           data-task-id="${task.id}" 
           style="animation-delay: ${index * 50}ms">
        
        <div class="task-header">
          <div class="task-title">${this.escapeHtml(task.title)}</div>
          ${isEditing ? '<div class="editing-indicator">✏️ Editing</div>' : ""}
        </div>
        
        <div class="task-meta">
          <span class="task-badge priority-${task.priority}">${priorityText[task.priority]}</span>
          <span class="task-badge status-${task.status}">${statusText[task.status]}</span>
        </div>
        
        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ""}
        
        <div class="task-dates">
          Created ${this.formatDate(task.createdAt)}
          ${task.updatedAt !== task.createdAt ? ` • Updated ${this.formatDate(task.updatedAt)}` : ""}
        </div>

        <div class="task-actions">
          <button class="task-action-btn edit-btn" onclick="taskManager.handleEditClick('${task.id}')" aria-label="Edit task">
            <span>✏️</span> Edit
          </button>
          <button class="task-action-btn delete-btn" onclick="taskManager.handleDeleteClick('${task.id}')" aria-label="Delete task">
            <span>🗑️</span> Delete
          </button>
        </div>
      </div>
    `
  }

  // Update statistics with modern display
  updateStats() {
    const statsElement = document.getElementById("taskStats")
    if (!statsElement) return

    const stats = this.getDetailedStats()

    let statsText = `${stats.total} task${stats.total !== 1 ? "s" : ""}`
    if (stats.total > 0) {
      const completionPercentage = Math.round((stats.completed / stats.total) * 100)
      statsText += ` • ${completionPercentage}% complete`
    }

    const statsTextElement = statsElement.querySelector(".stats-text")
    if (statsTextElement) {
      statsTextElement.textContent = statsText
    }
  }

  // Get detailed statistics
  getDetailedStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((task) => task.status === "done").length
    const inProgress = this.tasks.filter((task) => task.status === "in-progress").length
    const todo = this.tasks.filter((task) => task.status === "to-do").length

    const priority = {
      high: this.tasks.filter((task) => task.priority === "high").length,
      medium: this.tasks.filter((task) => task.priority === "medium").length,
      low: this.tasks.filter((task) => task.priority === "low").length,
    }

    return { total, completed, inProgress, todo, priority }
  }

  // Enhanced notification system
  showNotification(message, type = "info") {
    console.log(`📢 Notification: ${message} (${type})`)

    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => notification.remove())

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2em;">
          ${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
        </span>
        <span>${message}</span>
      </div>
    `

    document.body.appendChild(notification)

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOutRight 0.3s ease-in-out"
        setTimeout(() => notification.remove(), 300)
      }
    }, 4000)

    // Click to dismiss
    notification.addEventListener("click", () => {
      notification.style.animation = "slideOutRight 0.3s ease-in-out"
      setTimeout(() => notification.remove(), 300)
    })
  }

  // Utility functions with improvements
  escapeHtml(text) {
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

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  // Sort tasks by priority with stable sorting
  sortTasksByPriority(tasks = this.tasks) {
    const priorityOrder = { high: 1, medium: 2, low: 3 }

    return [...tasks].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Secondary sort by creation date (newest first within same priority)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  getTasksSortedByPriority() {
    return this.sortTasksByPriority()
  }

  getPriorityStats() {
    return this.tasks.reduce(
      (stats, task) => {
        stats[task.priority]++
        return stats
      },
      { high: 0, medium: 0, low: 0 },
    )
  }

  // Edit functionality with improved UX
  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    const currentTask = this.tasks[taskIndex]
    const updatedData = { ...currentTask, ...updates }

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

  enterEditMode(taskId) {
    this.exitEditMode()
    this.currentEditId = taskId
    this.populateEditForm(taskId)
    this.renderTasks()
  }

  exitEditMode() {
    this.currentEditId = null
    this.resetForm()
    this.renderTasks()
  }

  isInEditMode() {
    return this.currentEditId !== null
  }

  populateEditForm(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (!task) return

    const titleInput = document.getElementById("taskTitle")
    const descInput = document.getElementById("taskDescription")
    const prioritySelect = document.getElementById("taskPriority")
    const statusSelect = document.getElementById("taskStatus")

    if (titleInput) titleInput.value = task.title
    if (descInput) descInput.value = task.description || ""
    if (prioritySelect) prioritySelect.value = task.priority
    if (statusSelect) statusSelect.value = task.status

    // Update form UI for edit mode
    const formTitle = document.getElementById("formTitle")
    const submitBtn = document.getElementById("submitBtn")
    const cancelBtn = document.getElementById("cancelBtn")

    if (formTitle) {
      formTitle.innerHTML = '<span class="card-icon">✏️</span>Edit Task'
    }
    if (submitBtn) {
      submitBtn.innerHTML =
        '<span class="btn-icon">💾</span><span class="btn-text">Update Task</span><div class="btn-loader"></div>'
    }
    if (cancelBtn) {
      cancelBtn.style.display = "inline-flex"
    }

    // Scroll to form and focus
    titleInput?.focus()
    titleInput?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  handleEditClick(taskId) {
    this.enterEditMode(taskId)
  }

  handleSaveEdit() {
    if (!this.currentEditId) return

    try {
      const title = document.getElementById("taskTitle").value.trim()
      const description = document.getElementById("taskDescription").value.trim()
      const priority = document.getElementById("taskPriority").value
      const status = document.getElementById("taskStatus").value

      const updates = { title, description, priority, status }
      const updatedTask = this.updateTask(this.currentEditId, updates)

      this.showNotification(`Task "${updatedTask.title}" updated successfully!`, "success")
      this.exitEditMode()
      this.updateStats()
    } catch (error) {
      this.showNotification(error.message, "error")
    }
  }

  handleCancelEdit() {
    this.exitEditMode()
    this.showNotification("Edit cancelled", "info")
  }

  // Delete functionality with enhanced UI
  handleDeleteClick(taskId) {
    const task = this.getTaskById(taskId)
    if (!task) return

    this.requestDelete(taskId)
    this.showDeleteConfirmation(task)
  }

  showDeleteConfirmation(task) {
    const modal = document.createElement("div")
    modal.className = "delete-modal"
    modal.innerHTML = `
      <div class="delete-modal-content">
        <div class="delete-modal-header">
          <h3>🗑️ Delete Task</h3>
        </div>
        <div class="delete-modal-body">
          <p>Are you sure you want to delete this task?</p>
          <div class="task-preview">
            <strong>"${this.escapeHtml(task.title)}"</strong>
            <span class="task-badge priority-${task.priority}">
              ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <p class="warning-text">⚠️ This action cannot be undone.</p>
        </div>
        <div class="delete-modal-actions">
          <button class="confirm-delete-btn" onclick="taskManager.handleConfirmDelete()">
            🗑️ Delete Task
          </button>
          <button class="cancel-delete-btn" onclick="taskManager.handleCancelDelete()">
            Cancel
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.handleCancelDelete()
      }
    })

    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        this.handleCancelDelete()
        document.removeEventListener("keydown", handleEsc)
      }
    }
    document.addEventListener("keydown", handleEsc)
  }

  handleConfirmDelete() {
    try {
      const task = this.getTaskById(this.pendingDeleteId)
      this.confirmDelete()
      this.closeDeleteModal()
      this.renderTasks()
      this.updateStats()
      this.showNotification(`Task "${task.title}" deleted successfully!`, "success")
    } catch (error) {
      this.showNotification(error.message, "error")
    }
  }

  handleCancelDelete() {
    this.cancelDelete()
    this.closeDeleteModal()
  }

  closeDeleteModal() {
    const modal = document.querySelector(".delete-modal")
    if (modal) {
      modal.style.animation = "fadeOut 0.3s ease-in-out"
      setTimeout(() => modal.remove(), 300)
    }
  }

  // Bulk operations
  handleDeleteCompleted() {
    const completedTasks = this.tasks.filter((task) => task.status === "done")
    if (completedTasks.length === 0) {
      this.showNotification("No completed tasks to delete", "info")
      return
    }

    const count = this.deleteCompletedTasks()
    this.renderTasks()
    this.updateStats()
    this.showNotification(`${count} completed task${count !== 1 ? "s" : ""} deleted!`, "success")
  }

  // Core delete methods
  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    if (this.currentEditId === taskId) {
      this.exitEditMode()
    }

    this.tasks.splice(taskIndex, 1)
    this.saveTasks()
    return true
  }

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

  getTaskById(id) {
    return this.tasks.find((task) => task.id === id) || null
  }

  deleteCompletedTasks() {
    const completedTaskIds = this.tasks.filter((task) => task.status === "done").map((task) => task.id)
    return this.deleteTasks(completedTaskIds)
  }

  deleteTasks(taskIds) {
    let deletedCount = 0

    const tasksToDelete = taskIds
      .map((id) => ({ id, index: this.tasks.findIndex((task) => task.id === id) }))
      .filter((item) => item.index !== -1)
      .sort((a, b) => b.index - a.index)

    tasksToDelete.forEach(({ id, index }) => {
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
}

// Initialize app with modern enhancements
let taskManager

// Add CSS animations for slide effects
const style = document.createElement("style")
style.textContent = `
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  .task-item {
    animation: slideUp 0.3s ease-out backwards;
  }
`
document.head.appendChild(style)

document.addEventListener("DOMContentLoaded", () => {
  console.log("🎨 DOM Content Loaded - Initializing TaskEasy v2.0...")

  taskManager = new TaskManager()
  window.taskManager = taskManager

  // Focus on title input for better UX
  const titleInput = document.getElementById("taskTitle")
  if (titleInput) {
    setTimeout(() => titleInput.focus(), 500)
  }

  console.log("✅ TaskEasy v2.0 initialized successfully!")
  console.log("🎨 Modern UI/UX features active!")
})

// Fallback initialization
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log("🎨 DOM already ready - Initializing TaskEasy v2.0...")

  taskManager = new TaskManager()
  window.taskManager = taskManager

  const titleInput = document.getElementById("taskTitle")
  if (titleInput) {
    titleInput.focus()
  }

  console.log("✅ TaskEasy v2.0 initialized successfully!")
}
